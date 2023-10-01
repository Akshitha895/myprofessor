package com.smartgen.myprofessor;
import android.os.Bundle;
import android.content.Context;

import android.content.pm.ActivityInfo;
import com.facebook.react.ReactActivity;
import android.content.res.Configuration;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "StepUp";
  }
  public class ViewUtils {
    public boolean isTablet(Context context){
        return context.getResources().getBoolean(R.bool.isTablet);
    }
}
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
     ViewUtils  viewutils  =  new ViewUtils();
    if (viewutils.isTablet(this)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        }
  }
  @Override
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
}
}
