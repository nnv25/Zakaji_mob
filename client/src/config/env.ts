import Constants from "expo-constants";

/**
 * Универсальный безопасный доступ к extra
 */
const getEnv = () => {
  const expoConfig = Constants.expoConfig;
  const manifest2 = Constants.manifest2;

  // Expo SDK 50–52 (Expo Go / Dev)
  const devExtra =
    manifest2?.extra?.expoClient?.extra ??
    manifest2?.extra?.extra ??
    null;

  // Build (Standalone app)
  const prodExtra = expoConfig?.extra ?? null;

  return {
    ...(devExtra ?? {}),
    ...(prodExtra ?? {}),
  };
};

const ENV = getEnv();

// Переменные выносим в отдельные именованные константы
export const API_URL = ENV.API_URL;

export default ENV;