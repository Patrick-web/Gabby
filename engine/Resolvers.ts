import { actions } from "../stores/staticStore";
import { Contact } from "react-native-contacts";
import call from "react-native-phone-call";
import Tts from "react-native-tts";
import { removeHandler } from "./engine";

class BaseOfAResolver {
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

export class MakeCallResolver extends BaseOfAResolver {
  handlerID = "call";
  flows = true;
  possibleContacts: Contact[] = [];
  userContactName: null | string = null;
  promptedForContact = false;

  handleInput(text: string) {
    console.log(`Received Input: ${text}\n flow level: ${this.flowLevel}`);
    this.setHandler(this.handlerID);
    if (this.promptedForContact) {
      this.flow1(text);
      return;
    }
    if (this.flowLevel == 0) {
      this.flow0(text);
    } else if (this.flowLevel == 2) {
      this.flow2(text);
      // this.removeHandler();
    }
  }
  flow0(text: string) {
    console.log(`In flow level 0`);
    /*
        Flow Level 0 checks whether the user has provided a contactName in their prompt.
        If they provided a contactName, it calls flow1. 
        If the user did not provide a contactName, it returns a prompt for the contactName
      */
    this.userContactName = text.replace(/.*call/, "").trim() || null;
    console.log(`userContactName is: ${this.userContactName}`);
    if (this.userContactName) {
      this.flow1();
    } else {
      this.sendAMessage("Who do you want to call ?");
      setTimeout(() => {
        this.enableMic();
      }, 2100);
    }
  }
  flow1(contactName?: string) {
    console.log(`In flow level 1`);
    /*
        Flow Level 1 receives a contactName and gets all possibleContacts.
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
      this.makeCall(this.possibleContacts[0]);
    } else if (this.possibleContacts.length > 1) {
      console.log(this.possibleContacts[0]);
      const contactNames = this.possibleContacts
        .map((contact: Contact) => contact.displayName)
        .join(", ");
      this.sendAMessage(
        `Which of the following should I call: ${contactNames}`
      );
      this.flowLevel = 2;
      setTimeout(() => {
        this.enableMic();
      }, 8000);
    }
  }
  flow2(text: string) {
    console.log("In flow2");
    if (text) {
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
        this.sendAMessage(`Calling ${selectedContact.displayName}`);
        this.makeCall(selectedContact);
      }
    } else {
      // removeHandler();
      this.flowLevel = 0;
    }
  }
  makeCall(contact: Contact) {
    console.log("In makeCall");
    this.removeHandler();
    this.flowLevel = 0;
    const args = {
      number: contact.phoneNumbers[0].number, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };
    call(args).catch(console.error);
  }
}
