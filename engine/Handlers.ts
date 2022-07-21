import { actions } from "../stores/staticStore";
import { Contact } from "react-native-contacts";
import SendIntentAndroid from "react-native-send-intent";
import { sendDirectSms } from "../plugins/RNDirectSendSms/index";
import { Linking } from "react-native";
import { ChatBubbleVariants, ChatType, JokeType, QuoteType } from "../types";
import { sleep, speak } from "./utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

class BaseHandler {
  handlerID: string = "";
  flows = false; //If the resolver has conversation steps
  flowLevel = 0; // Current step in the conversation flow
  inFlow = false; // If a conversation flow is in progress

  addChatFx: (chat: ChatType) => void = () => {};
  toggleSpeakFx: Function | null = null;
  setHandler: Function = () => {};
  removeHandler: Function = () => {};

  constructor() {}

  setCoreFunctions(
    _addChatFx: (chat: ChatType) => void,
    _toggleSpeakFx: Function,
    _setHandler: Function,
    _removeHandler: Function
  ) {
    this.addChatFx = _addChatFx;
    this.toggleSpeakFx = _toggleSpeakFx;
    this.setHandler = _setHandler;
    this.removeHandler = _removeHandler;
  }
  sendAMessage(
    text: string,
    silent: boolean = false,
    variant: ChatBubbleVariants = "basic text"
  ) {
    try {
      if (this.addChatFx) {
        this.addChatFx({
          variant,
          text,
          extraData: { from: "assistant" },
        });
        if (!silent) {
          speak(text);
        }
      }
    } catch (error) {
      console.log("Error in sendAMessage");
    }
  }
  enableMic() {
    if (this.toggleSpeakFx) {
      this.toggleSpeakFx(true);
    }
  }
}

export class GreetingHandler extends BaseHandler {
  nextHandler: "" | "setNickname" = "";
  handlerID = "hello";
  handleInput(text: string) {
    this.setHandler(this.handlerID);
    if (this.nextHandler == "setNickname") {
      this.setNickname(text);
      return;
    }
    AsyncStorage.getItem("nickname").then((value) => {
      if (value) {
        this.sendAMessage(`Hello ${value}. How may I assist you?`);
      } else {
        this.promptNickname();
      }
    });
  }
  async promptNickname() {
    this.nextHandler = "setNickname";
    this.sendAMessage("Hey you, how may I...");
    await sleep(2000);
    this.sendAMessage("I just realized I dont know your name");
    await sleep(2000);
    this.sendAMessage("Let's stop right there. What should I call you");
    await sleep(3000);
    this.enableMic();
  }
  async setNickname(text: string) {
    console.log("Setting user name");
    this.removeHandler();
    await AsyncStorage.setItem("nickname", text);
    this.sendAMessage(`Great, from now on I'll call you ${text}`);
    await sleep(2500);
    this.sendAMessage(
      "If you want to change this just say 'call me <insert your nickname>'"
    );
  }
  cleanUp() {
    this.nextHandler = "";
  }
}

export class SetNicknameHandler extends BaseHandler {
  async handleInput(text: string) {
    const nickname = text.replace(/call me/i, "").trim();
    await AsyncStorage.setItem("nickname", nickname);
    this.sendAMessage(`Great, from now on I'll call you ${nickname}`);
  }
}

export class MakeCallHandler extends BaseHandler {
  handlerID = "call";
  flows = true;
  nextHandler:
    | "checkContactProvidedInPrompt"
    | "getTargetContact"
    | "handleSelectedPossibleContact" = "checkContactProvidedInPrompt";
  possibleContacts: Contact[] = [];
  userContactName: null | string = null;
  promptedForContact = false;
  selectedContact: Contact | null = null;

  handleInput(text: string) {
    this.setHandler(this.handlerID);
    console.log(`nextHandler: ${this.nextHandler}`);
    if (this.nextHandler == "checkContactProvidedInPrompt") {
      this.checkContactProvidedInPrompt(text);
      return;
    }
    if (this.nextHandler == "getTargetContact") {
      this.getTargetContact(text);
      return;
    }
    if (this.nextHandler == "handleSelectedPossibleContact") {
      this.handleSelectedPossibleContact(text);
      return;
    }
  }
  checkContactProvidedInPrompt(text: string) {
    console.log("checkContactProvidedInPrompt");
    /*
        Checks whether the user has provided a contactName in their prompt.
        If they provided a contactName, it calls flow1. 
        If the user did not provide a contactName, it returns a prompt for the contactName
      */
    this.userContactName = text.replace(/.*call/, "").trim() || null;
    if (this.userContactName) {
      this.getTargetContact();
    } else {
      this.nextHandler = "getTargetContact";
      this.sendAMessage("Who do you want to call ?");
      setTimeout(() => {
        this.enableMic();
      }, 2100);
    }
  }
  getTargetContact(contactName?: string) {
    console.log("getTargetContact");
    /*
        Receives a contactName and gets all possibleContacts.
          If only one possible contact was found it send that contact to the makeCall function
          If possibleContacts are more than one it returns a prompt for the user to select one
       */
    if (contactName) {
      this.userContactName = contactName;
    }
    console.log(this.userContactName);
    this.possibleContacts = actions.getPossibleContacts(
      this.userContactName as string
    );
    if (this.possibleContacts.length == 0) {
      this.sendAMessage("Sorry, I'm not finding a match in your contacts.");
      this.removeHandler();
    } else if (this.possibleContacts.length == 1) {
      this.selectedContact = this.possibleContacts[0];
      this.makeCall();
    } else if (this.possibleContacts.length > 1) {
      this.promptToSelectPossibleContact();
    }
  }
  promptToSelectPossibleContact() {
    console.log("promptToSelectPossibleContact");
    this.nextHandler = "handleSelectedPossibleContact";
    const contactNames = this.possibleContacts
      .map((contact: Contact) => contact.displayName)
      .join(", ");
    this.sendAMessage(`Which of the following should I call: ${contactNames}`);
    setTimeout(() => {
      this.enableMic();
    }, 8000);
  }

  handleSelectedPossibleContact(text: string) {
    console.log("handleSelectedPossibleContact");
    const pickedPossibleContactIndex =
      text.includes("first") || text.includes("number one")
        ? 0
        : text.includes("second") || text.includes("number two")
        ? 1
        : text.includes("third") || text.includes("number three")
        ? 2
        : text.includes("fourth") ||
          text.includes("four") ||
          text.includes("last")
        ? 3
        : 4;
    const selectedContact = this.possibleContacts[pickedPossibleContactIndex];
    if (selectedContact) {
      this.selectedContact = selectedContact;
      this.sendAMessage(`Calling ${selectedContact.displayName}`);
      setTimeout(() => {
        this.makeCall();
      }, 1500);
    } else {
      const pickedPossibleContactIndex = this.possibleContacts.findIndex(
        (contact) => contact.displayName == text
      );
      if (pickedPossibleContactIndex) {
        const selectedContact =
          this.possibleContacts[pickedPossibleContactIndex];
        this.selectedContact = selectedContact;
        this.sendAMessage(`Calling ${selectedContact.displayName}`);
        setTimeout(() => {
          this.makeCall();
        }, 1500);
      } else {
        this.sendAMessage("Sorry I didn't get that");
        this.removeHandler();
      }
    }
  }
  makeCall() {
    console.log("makeCall");
    this.removeHandler();
    if (!this.selectedContact?.phoneNumbers) {
      this.sendAMessage("Sorry an error occured");
      return;
    }
    this.removeHandler();
    this.sendAMessage("Ok");
    SendIntentAndroid.sendPhoneCall(
      this.selectedContact.phoneNumbers[0].number,
      true
    );
  }
  cleanUp() {
    this.nextHandler = "checkContactProvidedInPrompt";
  }
}

export class SendMessageHandler extends BaseHandler {
  handlerID = "message";
  flows = true;
  nextHandler:
    | "checkContactProvidedInPrompt"
    | "getTargetContact"
    | "handleSelectedPossibleContact"
    | "getMessageToSend"
    | "handleSpokenMessage"
    | "confirmSending"
    | "handleConfirmSendingResponse" = "checkContactProvidedInPrompt";
  possibleContacts: Contact[] = [];
  userContactName: null | string = null;
  promptedForContact = false;
  selectedContact: Contact | null = null;
  spokenMessge: string = "";

  handleInput(text: string) {
    console.log(`Received Input: ${text}\n flow level: ${this.flowLevel}`);
    this.setHandler(this.handlerID);
    if (this.nextHandler == "checkContactProvidedInPrompt") {
      this.checkContactProvidedInPrompt(text);
      return;
    }
    if (this.nextHandler == "getTargetContact") {
      this.getTargetContact(text);
      return;
    }
    if (this.nextHandler == "handleSelectedPossibleContact") {
      this.handleSelectedPossibleContact(text);
      return;
    }
    if (this.nextHandler == "getMessageToSend") {
      this.promptForMessageToSend();
      return;
    }
    if (this.nextHandler == "handleSpokenMessage") {
      this.handleSpokenMessage(text);
      return;
    }
    if (this.nextHandler == "confirmSending") {
      this.confirmSending();
      return;
    }
    if (this.nextHandler == "handleConfirmSendingResponse") {
      this.handleConfirmSendingResponse(text);
      return;
    }

    // this.removeHandler();
  }
  checkContactProvidedInPrompt(text: string) {
    console.log(`checkContactProvidedInPrompt`);
    /*
        Checks whether the user has provided a contactName in their prompt.
        If they provided a contactName, it calls flow1. 
        If the user did not provide a contactName, it returns a prompt for the contactName
      */
    this.userContactName =
      text
        .replace(/.*message/i, "")
        .replace(/.*sms/i, "")
        .replace(/.*text/i, "")
        .replace(/.*to/i, "")
        .trim() || null;
    console.log(`userContactName is: ${this.userContactName}`);
    if (this.userContactName) {
      this.getTargetContact();
    } else {
      this.nextHandler = "getTargetContact";
      this.sendAMessage("Who do you want to send a message to?");
      setTimeout(() => {
        this.enableMic();
      }, 2100);
    }
  }
  getTargetContact(contactName?: string) {
    console.log(`In flow level 1`);
    /*
        Receives a contactName and gets all possibleContacts.
          If only one possible contact was found it send that contact to the makeCall function
          If possibleContacts are more than one it returns a prompt for the user to select one
       */
    if (contactName) {
      this.userContactName = contactName;
    }
    console.log(this.userContactName);
    this.possibleContacts = actions.getPossibleContacts(
      this.userContactName as string
    );
    if (this.possibleContacts.length == 0) {
      this.sendAMessage("Sorry, I'm not finding a match in your contacts.");
      this.removeHandler();
    } else if (this.possibleContacts.length == 1) {
      this.selectedContact = this.possibleContacts[0];
      this.promptForMessageToSend();
    } else if (this.possibleContacts.length > 1) {
      this.promptToSelectPossibleContact();
    }
  }
  promptToSelectPossibleContact() {
    this.nextHandler = "handleSelectedPossibleContact";
    const contactNames = this.possibleContacts
      .map((contact: Contact) => contact.displayName)
      .join(", ");
    this.sendAMessage(
      `Whom of the following should I message? ${contactNames}`
    );
    setTimeout(() => {
      this.enableMic();
    }, 9000);
  }
  handleSelectedPossibleContact(text: any) {
    const pickedPossibleContactIndex =
      text.includes("first") || text.includes("one")
        ? 0
        : text.includes("second") || text.includes("two")
        ? 1
        : text.includes("third") || text.includes("three")
        ? 2
        : text.includes("fourth") || text.includes("last")
        ? 3
        : 4;
    const selectedContact = this.possibleContacts[pickedPossibleContactIndex];
    if (selectedContact) {
      this.selectedContact = selectedContact;
      this.promptForMessageToSend();
    } else {
      const pickedPossibleContactIndex = this.possibleContacts.findIndex(
        (contact) => contact.displayName == text
      );
      if (pickedPossibleContactIndex) {
        const selectedContact =
          this.possibleContacts[pickedPossibleContactIndex];
        this.selectedContact = selectedContact;
        this.promptForMessageToSend();
      } else {
        this.sendAMessage("Sorry I didn't get that");
        this.removeHandler();
      }
    }
  }
  promptForMessageToSend() {
    this.nextHandler = "handleSpokenMessage";
    this.sendAMessage(
      `You picked ${this.selectedContact?.displayName}. What's the message?`
    );
    setTimeout(() => {
      this.enableMic();
    }, 2800);
  }
  handleSpokenMessage(text: string) {
    if (text.length > 0) {
      this.spokenMessge = text;
      this.confirmSending();
    }
  }
  confirmSending() {
    this.nextHandler = "handleConfirmSendingResponse";
    this.sendAMessage("Got it. Ready to send it?");
    setTimeout(() => {
      this.enableMic();
    }, 2500);
  }
  handleConfirmSendingResponse(text: string) {
    const proceed =
      text.includes("yes") ||
      text.includes("sure") ||
      text.includes("yeah") ||
      text.includes("ok")
        ? true
        : false;
    this.removeHandler();
    if (proceed) {
      this.sendMessage();
    } else {
      this.nextHandler = "checkContactProvidedInPrompt";
      this.sendAMessage("Message sending canceled");
    }
  }
  sendMessage() {
    this.removeHandler();
    if (!this.selectedContact?.phoneNumbers) return;
    const message = this.spokenMessge;
    const contactNumber = this.selectedContact.phoneNumbers[0].number;
    sendDirectSms(contactNumber, message);
    this.sendAMessage("Message Sent");
  }
  cleanUp() {
    this.nextHandler = "checkContactProvidedInPrompt";
  }
}

export class SendWhatsappMessageHandler extends BaseHandler {
  handlerID = "whatsapp";
  flows = true;
  nextHandler:
    | "checkContactProvidedInPrompt"
    | "getTargetContact"
    | "handleSelectedPossibleContact"
    | "getMessageToSend"
    | "handleSpokenMessage"
    | "confirmSending"
    | "handleConfirmSendingResponse" = "checkContactProvidedInPrompt";
  possibleContacts: Contact[] = [];
  userContactName: null | string = null;
  promptedForContact = false;
  selectedContact: Contact | null = null;
  spokenMessge: string = "";

  handleInput(text: string) {
    console.log(`Received Input: ${text}\n flow level: ${this.flowLevel}`);
    this.setHandler(this.handlerID);
    if (this.nextHandler == "checkContactProvidedInPrompt") {
      this.checkContactProvidedInPrompt(text);
      return;
    }
    if (this.nextHandler == "getTargetContact") {
      this.getTargetContact(text);
      return;
    }
    if (this.nextHandler == "handleSelectedPossibleContact") {
      this.handleSelectedPossibleContact(text);
      return;
    }
    if (this.nextHandler == "getMessageToSend") {
      this.promptForMessageToSend();
      return;
    }
    if (this.nextHandler == "handleSpokenMessage") {
      this.handleSpokenMessage(text);
      return;
    }
    if (this.nextHandler == "confirmSending") {
      this.confirmSending();
      return;
    }
    if (this.nextHandler == "handleConfirmSendingResponse") {
      this.handleConfirmSendingResponse(text);
      return;
    }

    // this.removeHandler();
  }
  checkContactProvidedInPrompt(text: string) {
    console.log(`checkContactProvidedInPrompt`);
    /*
        Checks whether the user has provided a contactName in their prompt.
        If they provided a contactName, it calls flow1. 
        If the user did not provide a contactName, it returns a prompt for the contactName
      */
    this.userContactName =
      text
        .replace(/.*message/i, "")
        .replace(/.*sms/i, "")
        .replace(/.*text/i, "")
        .replace(/.*to/i, "")
        .replace(/.*whatsapp/i, "")
        .trim() || null;
    console.log(`userContactName is: ${this.userContactName}`);
    if (this.userContactName) {
      this.getTargetContact();
    } else {
      this.nextHandler = "getTargetContact";
      this.sendAMessage("Who do you want to whatsapp?");
      setTimeout(() => {
        this.enableMic();
      }, 2100);
    }
  }
  getTargetContact(contactName?: string) {
    /*
        Receives a contactName and gets all possibleContacts.
          If only one possible contact was found it send that contact to the makeCall function
          If possibleContacts are more than one it returns a prompt for the user to select one
       */
    if (contactName) {
      this.userContactName = contactName;
    }
    console.log(this.userContactName);
    this.possibleContacts = actions.getPossibleContacts(
      this.userContactName as string
    );
    if (this.possibleContacts.length == 0) {
      this.sendAMessage("Sorry, I'm not finding a match in your contacts.");
      this.removeHandler();
    } else if (this.possibleContacts.length == 1) {
      this.selectedContact = this.possibleContacts[0];
      this.promptForMessageToSend();
    } else if (this.possibleContacts.length > 1) {
      this.promptToSelectPossibleContact();
    }
  }
  promptToSelectPossibleContact() {
    this.nextHandler = "handleSelectedPossibleContact";
    const contactNames = this.possibleContacts
      .map((contact: Contact) => contact.displayName)
      .join(", ");
    this.sendAMessage(
      `Whom of the following should I whatsapp? ${contactNames}`
    );
    setTimeout(() => {
      this.enableMic();
    }, 9000);
  }
  handleSelectedPossibleContact(text: any) {
    const pickedPossibleContactIndex =
      text.includes("first") || text.includes("one")
        ? 0
        : text.includes("second") || text.includes("two")
        ? 1
        : text.includes("third") || text.includes("three")
        ? 2
        : text.includes("fourth") || text.includes("last")
        ? 3
        : 4;
    const selectedContact = this.possibleContacts[pickedPossibleContactIndex];
    if (selectedContact) {
      this.selectedContact = selectedContact;
      this.promptForMessageToSend();
    } else {
      const pickedPossibleContactIndex = this.possibleContacts.findIndex(
        (contact) => contact.displayName == text
      );
      if (pickedPossibleContactIndex) {
        const selectedContact =
          this.possibleContacts[pickedPossibleContactIndex];
        this.selectedContact = selectedContact;
        this.promptForMessageToSend();
      } else {
        this.sendAMessage("Sorry I didn't get that");
        this.removeHandler();
      }
    }
  }
  promptForMessageToSend() {
    this.nextHandler = "handleSpokenMessage";
    this.sendAMessage(
      `You picked ${this.selectedContact?.displayName}. What's the message?`
    );
    setTimeout(() => {
      this.enableMic();
    }, 2800);
  }
  handleSpokenMessage(text: string) {
    if (text.length > 0) {
      this.spokenMessge = text;
      this.confirmSending();
    }
  }
  confirmSending() {
    this.nextHandler = "handleConfirmSendingResponse";
    this.sendAMessage("Got it. Ready to send it?");
    setTimeout(() => {
      this.enableMic();
    }, 2500);
  }
  handleConfirmSendingResponse(text: string) {
    const proceed =
      text.includes("yes") ||
      text.includes("sure") ||
      text.includes("yeah") ||
      text.includes("ok")
        ? true
        : false;
    this.removeHandler();
    if (proceed) {
      this.sendMessage();
    } else {
      this.nextHandler = "checkContactProvidedInPrompt";
      this.sendAMessage("Message sending canceled");
    }
  }
  sendMessage() {
    this.removeHandler();
    if (!this.selectedContact?.phoneNumbers) return;
    const message = encodeURI(this.spokenMessge);
    const contactNumber = this.selectedContact.phoneNumbers[0].number;
    this.sendAMessage("Done");
    Linking.openURL(`https://wa.me/+254${contactNumber}?text=${message}`);
  }
  cleanUp() {
    this.nextHandler = "checkContactProvidedInPrompt";
  }
}

export class AppOpenerHandler extends BaseHandler {
  handleInput(text: string) {
    const apps = actions.getApps();
    const appName = text.replace("open", "").trim().toLowerCase();
    const targetApp = apps.find((app) => app.appName.toLowerCase() == appName);
    if (targetApp) {
      SendIntentAndroid.openApp(targetApp.packageName, {}).then((wasOpened) => {
        if (wasOpened) {
          this.sendAMessage(`Opened ${targetApp.appName}`);
        } else {
          this.sendAMessage("Sorry, an error occured");
        }
      });
    } else {
      this.sendAMessage("No app found with that name");
    }
  }
}

export class SendEmailHandeler extends BaseHandler {
  handlerID: string = "email";
  nextHandler:
    | "checkRecipientProvidedInPrompt"
    | "handleRecipient"
    | "handleEmailBody"
    | "handleConfirmationResponse" = "checkRecipientProvidedInPrompt";
  userEmail: string = "";
  formatedEmail: string = "";
  emailBody: string = "";

  handleInput(text: string) {
    this.setHandler(this.handlerID);

    if (this.nextHandler == "checkRecipientProvidedInPrompt") {
      this.checkRecipientProvidedInPrompt(text);
      return;
    }
    if (this.nextHandler == "handleRecipient") {
      this.handleRecipient(text);
      return;
    }
    if (this.nextHandler == "handleEmailBody") {
      this.handleEmailBody(text);
      return;
    }
    if (this.nextHandler == "handleConfirmationResponse") {
      this.handleConfirmationResponse(text);
      return;
    }
  }
  checkRecipientProvidedInPrompt(text: string) {
    this.userEmail = text.replace(/.*to/i, "").trim() || "";
    if (this.userEmail && this.userEmail.includes("gmail.com")) {
      this.promptForEmailBody();
    } else {
      this.getEmailRecipient();
    }
  }
  getEmailRecipient() {
    this.nextHandler = "handleRecipient";
    this.sendAMessage("Ok, who should I send it to?");
    setTimeout(() => {
      this.enableMic();
    }, 2500);
  }
  handleRecipient(text: string) {
    this.userEmail = text;
    if (this.userEmail.endsWith("gmail.com")) {
      const formatedEmail = this.userEmail
        .replace("at gmail", "@gmail")
        .replace(/ /g, "")
        .toLowerCase();
      this.formatedEmail = formatedEmail;
      this.promptForEmailBody();
    } else {
      this.sendAMessage("That is not a valid email address");
      this.removeHandler();
    }
  }
  promptForEmailBody() {
    this.nextHandler = "handleEmailBody";
    const formatedEmail = this.userEmail
      .replace("at gmail", "@gmail")
      .replace(/ /g, "")
      .toLowerCase();
    this.formatedEmail = formatedEmail;

    this.sendAMessage(
      `Ok,recipient is ${this.formatedEmail}. Whats is the email body`
    );
    setTimeout(() => {
      this.enableMic();
    }, 3000);
  }
  handleEmailBody(text: string) {
    this.emailBody = text;
    this.confirmSending();
  }
  confirmSending() {
    this.nextHandler = "handleConfirmationResponse";
    this.sendAMessage("Ok, ready to send?");
    setTimeout(() => {
      this.enableMic();
    }, 2500);
  }
  handleConfirmationResponse(text: string) {
    const proceed =
      text.includes("yes") ||
      text.includes("sure") ||
      text.includes("yeah") ||
      text.includes("ok")
        ? true
        : false;
    this.removeHandler();
    if (proceed) {
      this.sendEmail();
    } else {
      this.sendAMessage("Email sending canceled");
      this.removeHandler();
    }
  }
  sendEmail() {
    this.removeHandler();
    SendIntentAndroid.sendMail(this.formatedEmail, this.emailBody);
    this.sendAMessage("Done");
  }
  cleanUp() {
    this.nextHandler = "checkRecipientProvidedInPrompt";
  }
}

export class TellJokeHandler extends BaseHandler {
  async handleInput() {
    this.sendAMessage("Ok...");
    const response = await fetch("https://api.dadjokes.io/api/random/joke");
    const resJson = await response.json();
    const jokeObj: JokeType = resJson.body[0];

    this.sendAMessage(jokeObj.setup);

    setTimeout(() => {
      this.sendAMessage(jokeObj.punchline);
    }, 5000);
  }
}

export class GiveQuoteHandler extends BaseHandler {
  async handleInput() {
    this.sendAMessage("Ok...");
    const response = await fetch("https://api.quotable.io/random");
    const quoteObj: QuoteType = await response.json();

    this.sendAMessage(quoteObj.content);

    setTimeout(() => {
      this.sendAMessage(`by ${quoteObj.author}`);
    }, 5000);
  }
}

export class GetNewsHandler extends BaseHandler {
  handleInput() {
    this.sendAMessage("Here are the top stories");
    this.addChatFx({
      text: "",
      variant: "news",
      extraData: { modalChild: "news" },
    });
  }
}

export class GoogleItHandler extends BaseHandler {
  handleInput(text: string) {
    let query = text;
    if (text.toLowerCase().startsWith("google")) {
      query = text.replace(/google /i, "");
    }
    const url = encodeURI(`https://www.google.com/search?hl=en&q=${query}`);
    this.sendAMessage("Let me check...");
    this.addChatFx({ text: "", variant: "google", extraData: { url } });
  }
}

export class PlayMusicHandler extends BaseHandler {
  handleInput(text: string) {
    let query = text;
    if (text.startsWith("play")) {
      query = text.replace(/play /i, "");
    }
    const url = `https://m.soundcloud.com/search?q=${query}`;
    this.sendAMessage("Let's jam");
    this.addChatFx({
      text: "",
      variant: "music",
      extraData: { modalChild: "music", url },
    });
  }
}

export class GetMemesHandler extends BaseHandler {
  handleInput() {
    this.sendAMessage("Memes coming right up");
    this.addChatFx({
      text: "",
      variant: "memes",
      extraData: { modalChild: "memes" },
    });
  }
}

export class PlayGamesHandler extends BaseHandler {
  handleInput(text: string) {
    if (text.includes("chess")) {
      this.sendAMessage("Opening chess");
      this.addChatFx({
        text: "",
        variant: "games",
        extraData: { modalChild: "chess" },
      });
      return;
    }
    if (text.includes("sudoku")) {
      this.sendAMessage("Opening Sudoku");
      this.addChatFx({
        text: "",
        variant: "games",
        extraData: { modalChild: "sudoku" },
      });
      return;
    }
    if (text.includes("checkers")) {
      this.sendAMessage("Opening Checkers");
      this.addChatFx({
        text: "",
        variant: "games",
        extraData: { modalChild: "checkers" },
      });
      return;
    }
    this.sendAMessage("Okay, choose one");
    this.addChatFx({
      text: "",
      variant: "games",
      extraData: { modalChild: "games" },
    });
  }
}

export class GetCreatorHandler extends BaseHandler {
  async handleInput() {
    this.sendAMessage("Thought you'd never ask");
    await sleep(2000);
    this.sendAMessage("I was made by Patrick");
    await sleep(2000);
    this.sendAMessage("If you want to reach out to him here are his details");
    await sleep(2500);
    this.sendAMessage(
      "His twitter is @PnTX10, Github is Patrick-web and email is patrickwaweruofficial@gmail.com"
    );
  }
}

export class ToggleVoiceHandler extends BaseHandler {
  handleInput(text: string) {
    if (text.includes("off") || text.includes("shut up")) {
      actions.setVoiceReplies(false);
    }
    if (text.includes("on") || text.includes("talk to me")) {
      actions.setVoiceReplies(true);
    }
    this.sendAMessage("Ok");
  }
}
