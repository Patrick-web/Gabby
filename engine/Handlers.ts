import { actions } from "../stores/staticStore";
import { Contact } from "react-native-contacts";
import Tts from "react-native-tts";
import SendIntentAndroid from "react-native-send-intent";

class BaseHandler {
  handlerID: string = "";
  flows = false; //If the resolver has conversation steps
  flowLevel = 0; // Current step in the conversation flow
  inFlow = false; // If a conversation flow is in progress

  addChatFx: null | Function = null;
  toggleSpeakFx: Function | null = null;
  setHandler: Function = () => {};
  removeHandler: Function = () => {};

  constructor() {}

  setCoreFunctions(
    _addChatFx: Function,
    _toggleSpeakFx: Function,
    _setHandler: Function,
    _removeHandler: Function
  ) {
    this.addChatFx = _addChatFx;
    this.toggleSpeakFx = _toggleSpeakFx;
    this.setHandler = _setHandler;
    this.removeHandler = _removeHandler;
  }
  sendAMessage(text: string) {
    if (this.addChatFx) {
      this.addChatFx({ from: "assistant", text });
      Tts.speak(text);
    }
  }
  enableMic() {
    if (this.toggleSpeakFx) {
      this.toggleSpeakFx(true);
    }
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
      this.cleanUp();
    } else if (this.possibleContacts.length == 1) {
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
        this.cleanUp();
      }
    }
  }
  makeCall() {
    console.log("makeCall");
    this.cleanUp();
    if (!this.selectedContact?.phoneNumbers) return;
    this.removeHandler();
    SendIntentAndroid.sendPhoneCall(
      this.selectedContact.phoneNumbers[0].number,
      true
    );
  }
  cleanUp() {
    this.removeHandler();
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
      this.cleanUp();
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
        this.cleanUp();
      }
    }
  }
  promptForMessageToSend() {
    this.nextHandler = "handleSpokenMessage";
    this.sendAMessage("Ok, what's the message?");
    setTimeout(() => {
      this.enableMic();
    }, 2500);
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
    this.cleanUp();
    if (proceed) {
      this.sendMessage();
    } else {
      this.nextHandler = "checkContactProvidedInPrompt";
    }
  }
  sendMessage() {
    if (!this.selectedContact?.phoneNumbers) return;
    const message = this.spokenMessge;
    const contactNumber = this.selectedContact.phoneNumbers[0].number;
    SendIntentAndroid.sendDirectSms(contactNumber, message);
    this.sendAMessage("Message Sent");
  }
  cleanUp() {
    this.removeHandler();
    this.nextHandler = "checkContactProvidedInPrompt";
  }
}
