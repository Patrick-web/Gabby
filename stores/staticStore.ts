import Contacts, { Contact } from "react-native-contacts";

interface StaticState {
  contacts: Contact[];
}

export const state: StaticState = {
  contacts: [],
};

export const actions = {
  getPossibleContacts: (text: string) => {
    const possibles = state.contacts.filter((contact: Contact) =>
      contact.displayName.toLowerCase().includes(text.toLowerCase())
    );
    return possibles;
  },
};

export function initStore() {
  Contacts.getAll().then((contacts) => {
    console.log(contacts);
    state.contacts = contacts;
  });
}
