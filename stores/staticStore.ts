import { PermissionsAndroid } from "react-native";
import Contacts, { Contact } from "react-native-contacts";

interface StaticState {
  contacts: Contact[];
}

export const state: StaticState = {
  contacts: [],
};

export const actions = {
  getPossibleContacts: (text: string) => {
    const possibles = state.contacts
      .filter(
        (contact: Contact) =>
          contact.displayName?.toLowerCase().includes(text.toLowerCase()) ||
          contact.givenName?.toLowerCase().includes(text.toLowerCase()) ||
          contact.middleName?.toLowerCase().includes(text.toLowerCase()) ||
          contact.prefix?.toLowerCase().includes(text.toLowerCase()) ||
          contact.suffix?.toLowerCase().includes(text.toLowerCase())
      )
      .filter((contact) => contact?.phoneNumbers[0]?.number);
    // console.log("=====");
    // console.log(possibles[0]);
    // console.log(possibles[1]);
    // console.log("=====");
    return possibles.slice(0, 4);
  },
};

export async function initStore() {
  await getContacts();
}

async function getContacts() {
  console.log("==========Getting Contacts ========");
  const hasContactsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
  );
  if (hasContactsPermission) {
    Contacts.getAll().then((contacts) => {
      state.contacts = contacts;
    });
  } else {
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "Grant access to Contacts",
        message: "In order to make calls and send messages",
        buttonPositive: "Allow",
        buttonNegative: "Deny",
      }
    );
    if (response == "granted") {
      Contacts.getAll().then((contacts) => {
        state.contacts = contacts;
      });
    }
  }
}
