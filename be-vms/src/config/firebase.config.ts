import { registerAs } from '@nestjs/config';
import { FirebaseConfigType } from './firebase-config.type';

export default registerAs('firebase', (): FirebaseConfigType => {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  };
});
