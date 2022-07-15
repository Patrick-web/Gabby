import { CommandYieldType } from "../types";

export function greeting(text: string) {
  const user = "Patrick";
  if (text.includes("Morning")) {
    return `Good Morning to you too ${user}. How may I help?`;
  }
  return "Hey there, how can I help";
}

let makeCallFlowLevel = 0;
export function makeCallResolver(
  text: string,
  flowLevel: Number
): CommandYieldType {
  if (makeCallFlowLevel == 0) {
    const contactName = text.replace(/.*call/, "");
    if (contactName.length > 2) {
      /*
        Send Possible Contacts to user,
        If possible contacts is one move to flowLevel 1
      */
      const contactName = text;
      const possibleContacts = getMatchingContacts(contactName);
    } else {
      // Prompt for contactName
      makeCallFlowLevel += 1;
      return {
        responseString: `Ok, Calling ${contactName}`,
        conversationFlowLevel: makeCallFlowLevel,
        conversationFunction: makeCallResolver,
      };
    }
  }
  function flow0() {
    /*
      Flow Level 0 checks whether the user has provided a contactName in their prompt.
      If they provided a contactName, it calls flow1. 
      If the user did not provide a contactName, it returns a prompt for the contactName
    */
  }

  function flow1() {
    /*
      Flow Level 1 receives a contactName and gets all possibleContacts.
        If only one possible contact was found it send that contact to the makeCall function
        If possibleContacts are more than one it returns a prompt for the user to select one
     */
  }

  function flow2(userSelectedIndex: string | null) {
    /*
    Flow Level 2 receives text that targets a specific contact from the possibleContacts provided to the user.
    The text is in this form  "The first one or second one,..." From the selector it gets the 
    corresponding contact a calls the makeCall function
  */

    //Reset the conversation flow as we are at the end of the flow
    makeCallFlowLevel += 0;
  }

  function makeCall() {}
}

let sendMessageFlowLevel = 0;
export function sendMessageResolver(
  text: string,
  flowLevel: Number
): CommandYieldType {
  if (sendMessageFlowLevel == 0) {
    //Check if user provided a contact in their prompt

    const contactName = text
      .replace(/(.*message)|(.*text)/i, "")
      .replace("to", "")
      .trim();

    //If contact name was provided in first prompt then go to contact chooser
    if (contactName.length > 2) {
      return {
        responseString: `Messaging ${contactName}`,
        conversationFlowLevel: null,
        conversationFunction: null,
      };
    } else {
      //If contactName was not provided in the prompt, then prompt for it
      sendMessageFlowLevel += 1;
      return {
        responseString: `Who should I message?`,
        conversationFlowLevel: sendMessageFlowLevel,
        conversationFunction: sendMessageResolver,
      };
    }
  }
  if (sendMessageFlowLevel == 1) {
  }

  function sendMessage(contactName: string, message: string) {}
}

function getMatchingContacts(nameGiven: string): string[] | null {
  console.log(nameGiven);
}

export function sendEmail(text: string) {
  console.log(text);
}

export function getWeather(text: string) {
  console.log(text);
}

export function readNotifications() {}

export function openApp(text: string) {}

export function changeBrightness(text: string) {}

export function getBattery() {}

export function manageReminders(text: string) {}

export function createReminder(text: string) {
  console.log(text);
}

export function getReminders(text: string) {}

export function deleteReminder(text: string) {}

export function editReminder(text: string) {}
