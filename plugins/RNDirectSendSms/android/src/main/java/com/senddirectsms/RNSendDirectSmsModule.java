package com.senddirectsms;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.telephony.SmsManager;
import android.widget.Toast;

public class RNSendDirectSmsModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    RNSendDirectSmsModule(ReactApplicationContext reactContext) {
      super(reactContext);
      this.reactContext = reactContext;
    }

    @Override
    public String getName() {
      return "RNSendDirectSmsModule";
    }

    @ReactMethod
    public void sendDirectSms(String phoneNumberString, String body) {
     try {      
          SmsManager smsManager = SmsManager.getDefault();
          smsManager.sendTextMessage(phoneNumberString, null, body, null, null);   
          Toast.makeText(reactContext, "Message Sent",
          Toast.LENGTH_LONG).show();
      } catch (Exception ex) {
          Toast.makeText(reactContext,ex.getMessage().toString(),Toast.LENGTH_LONG).show();
          ex.printStackTrace();
      } 
    }
}
