import 'dotenv/config';
import baseConfig from './app.base.json';

export default {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};