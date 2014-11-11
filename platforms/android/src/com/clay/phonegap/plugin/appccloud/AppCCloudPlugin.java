package com.clay.phonegap.plugin.appccloud;

import android.util.Log;
import net.app_c.cloud.sdk.AppCCloud;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AppCCloudPlugin extends CordovaPlugin {
    private static final String TAG = "AppCCloudPlugin";
    private AppCCloud appCCloud;

    public static final String AD_TYPE_LIST_VIEW = "listView";
    public static final String AD_TYPE_NATIVE = "native";

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        if (this.appCCloud == null) {
            // appC cloud生成
            Log.i(TAG, "Start initialize appC cloud SDK.");
            this.appCCloud = new AppCCloud(cordova.getActivity()).start();
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (AD_TYPE_LIST_VIEW.equals(action)) {
            this.createListView(callbackContext);
            return true;
        } else if (AD_TYPE_NATIVE.equals(action)) {
            this.createNative(callbackContext);
            return true;
        }

        return false;
    }

    private PluginResult createListView(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                // 広告リストビュー呼び出し
                appCCloud.Ad.callWebActivity();
                callbackContext.success();
            }
        });

        return null;
    }

    private PluginResult createNative(final CallbackContext callbackContext) {
        callbackContext.success();
        return null;
    }
}
