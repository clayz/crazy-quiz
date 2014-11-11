package com.clay.phonegap.plugin.appccloud;

import net.app_c.cloud.sdk.AppCCloud;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AppCCloudPlugin extends CordovaPlugin {
    public static final String AD_TYPE_LIST_VIEW = "listView";

    private AppCCloud appCCloud;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        // your init code here
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (AD_TYPE_LIST_VIEW.equals(action)) {
            this.executeCreateListView(callbackContext);

            return true;
        }

        return false;
    }

    private PluginResult executeCreateListView(final CallbackContext callbackContext) {
        if (this.appCCloud == null) {
            // appC cloud生成
            appCCloud = new AppCCloud(cordova.getActivity()).start();
        }

        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                // 広告リストビュー呼び出し
                appCCloud.Ad.callWebActivity();
            }
        });

        return null;
    }

//    public void finish() {
//        cordova.getActivity().finish();
//        // appC cloud終了処理
//        appCCloud.finish();
//    }
//
//    private boolean check() {
//        // 広告リスト表示確認
//        return appCCloud.Ad.isWebActivity();
//    }
}
