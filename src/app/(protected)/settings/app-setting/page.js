// src/app/(protected)/settings/app-setting/page.js
import AppSetting from "../../../../components/SettingsPage/AppSetting";
// import Settings from "@/components/SettingsPage/Settings";
import NavigationBar from "@/components/NavigationBar/NavigationBar";

export const metadata = { title: "앱 설정" };


export default function AppSettingPage() {
  return (
    <div>
      <AppSetting />
      <NavigationBar />
    </div>
  );
}
