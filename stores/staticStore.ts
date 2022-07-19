import {PermissionsAndroid} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import RNInstalledApplication from 'react-native-installed-application';
import {AppType} from '../types';

interface StaticState {
  contacts: Contact[];
  apps: AppType[];
}

export const state: StaticState = {
  contacts: [],
  apps: [],
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
          contact.suffix?.toLowerCase().includes(text.toLowerCase()),
      )
      .filter(contact => contact?.phoneNumbers[0]?.number);
    possibles = possibles.filter(
      (v, i, a) => a.findIndex(v2 => v2.displayName === v.displayName) === i,
    );
    return possibles.slice(0, 4);
  },
  getApps: () => state.apps,
};

export async function initStore() {
  await getContacts();
  await requestPhoneCallPermission();
  await requestSendSMSPermission();
  await getApps();
}

async function getApps() {
  try {
    const apps = await RNInstalledApplication.getApps();
    state.apps = apps;
  } catch (error) {
    console.log('Error');
  }
}

async function requestSendSMSPermission() {
  const hasSMSPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
  );
  console.log(`Send SMS permission: ${hasSMSPermission}`);
  if (hasSMSPermission) return;
  const response = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
    {
      title: 'Grant SMS permission',
      message: 'In order to send messsages',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );
  console.log(`Send SMS Request: ${response}`);
}

async function requestPhoneCallPermission() {
  const hasCallPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
  );
  console.log(`Call phone permission: ${hasCallPermission}`);
  if (hasCallPermission) return;
  const response = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    {
      title: 'Grant access to make calls',
      message: 'In order to make calls',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );
  console.log(`Call Request: ${response}`);
}

async function getContacts() {
  console.log('==========Getting Contacts ========');
  const hasContactsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  );
  if (hasContactsPermission) {
    Contacts.getAll().then(contacts => {
      state.contacts = contacts;
    });
  } else {
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Grant access to Contacts',
        message: 'In order to make calls and send messages',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    if (response == 'granted') {
      Contacts.getAll().then(contacts => {
        state.contacts = contacts;
      });
    }
  }
}
