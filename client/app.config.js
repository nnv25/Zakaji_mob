import "dotenv/config";
import baseConfig from "./app.base.json";

export default {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,

    // 🔥 Добавили android.package — ОБЯЗАТЕЛЬНО ДЛЯ EAS BUILD
    android: {
      ...(baseConfig.expo?.android || {}),
      package: "com.zakaji.client", // ← можешь поменять если хочешь
      usesCleartextTraffic: true,
    },

    // 🔥 Добавили projectId — обязателен для expo-notifications
    extra: {
      API_URL: "http://192.168.0.15:4000",

      eas: {
        projectId: "25c5ba59-5a1c-4a9a-84c6-d9f57782d415",
      },
    },
  },
};
