import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid } from "react-native";
import Contacts, { Contact } from "react-native-contacts";
import RNInstalledApplication from "react-native-installed-application";
import { AppType } from "../types";

interface StaticState {
  contacts: Contact[];
  apps: AppType[];
  voiceReplies: boolean;
}

export const state: StaticState = {
  contacts: [],
  apps: [],
  voiceReplies: true,
};

export const actions = {
  getPossibleContacts: (text: string) => {
    let possibles = state.contacts
      .filter(
        (contact: Contact) =>
          contact.displayName?.toLowerCase().includes(text.toLowerCase()) ||
          contact.givenName?.toLowerCase().includes(text.toLowerCase()) ||
          contact.middleName?.toLowerCase().includes(text.toLowerCase()) ||
          contact.prefix?.toLowerCase().includes(text.toLowerCase()) ||
          contact.suffix?.toLowerCase().includes(text.toLowerCase())
      )
      .filter((contact) => contact?.phoneNumbers[0]?.number);
    possibles = possibles.filter(
      (v, i, a) => a.findIndex((v2) => v2.displayName === v.displayName) === i
    );
    return possibles.slice(0, 4);
  },
  getApps: () => state.apps,
  setVoiceReplies: (_state: boolean) => {
    state.voiceReplies = _state;
    AsyncStorage.setItem("voiceReplies", JSON.stringify(_state));
  },
  useVoiceReply: () => state.voiceReplies,
};

export async function initStore() {
  console.log("Initializing");
  await getContacts();
  console.log("Contacts done");
  await requestPhoneCallPermission();
  await requestSendSMSPermission();
  await getApps();
  console.log("Apps done");
}

async function getApps() {
  try {
    let apps = await AsyncStorage.getItem("apps");
    if (apps) {
      apps = JSON.parse(apps);
      console.log(apps?.length);
      console.log("Apps from async storage");
      return;
    } else {
      return await initApps();
    }
  } catch (error) {
    console.log("error initApps");
    return await initApps();
  }
  async function initApps() {
    try {
      const apps = await RNInstalledApplication.getNonSystemApps();
      state.apps = apps;
      await AsyncStorage.setItem("apps", JSON.stringify(apps));
      console.log("Apps saved");
      return;
    } catch (error) {
      console.log("Error");
      return;
    }
  }
}

async function requestSendSMSPermission() {
  const hasSMSPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.SEND_SMS
  );
  console.log(`Send SMS permission: ${hasSMSPermission}`);
  if (hasSMSPermission) return;
  const response = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
    {
      title: "Grant SMS permission",
      message: "In order to send messsages",
      buttonPositive: "Allow",
      buttonNegative: "Deny",
    }
  );
  console.log(`Send SMS Request: ${response}`);
}

async function requestPhoneCallPermission() {
  const hasCallPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE
  );
  console.log(`Call phone permission: ${hasCallPermission}`);
  if (hasCallPermission) return;
  const response = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    {
      title: "Grant access to make calls",
      message: "In order to make calls",
      buttonPositive: "Allow",
      buttonNegative: "Deny",
    }
  );
  console.log(`Call Request: ${response}`);
}

async function getContacts() {
  try {
    let contacts = await AsyncStorage.getItem("contacts");
    if (contacts && false) {
      contacts = JSON.parse(contacts);
      console.log("Contacts from async storage");
      return;
    } else {
      return await initContacts();
    }
  } catch (error) {
    return await initContacts();
  }

  async function initContacts() {
    const hasContactsPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS
    );
    if (hasContactsPermission) {
      Contacts.getAll().then(async (contacts) => {
        state.contacts = contacts;
        await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
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
        Contacts.getAll().then(async (contacts) => {
          state.contacts = contacts;
          await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
        });
      }
    }
  }
}
