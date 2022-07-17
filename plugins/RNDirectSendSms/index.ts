/**
 * @providesModule sendDirectSmsModule
 */

import { NativeModules } from "react-native";

const RNSendDirectSMSModule = NativeModules.RNSendDirectSmsModule || {};

export function sendDirectSms(phoneNumber: string, body: string) {
  RNSendDirectSMSModule.sendDirectSms(phoneNumber, body);
}
