import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID', {
        infer: true,
      });
      const privateKey = this.configService.get<string>(
        'FIREBASE_PRIVATE_KEY',
        {
          infer: true,
        },
      );
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
        {
          infer: true,
        },
      );

      if (!projectId || !privateKey || !clientEmail) {
        console.warn(
          'Firebase credentials not found. Push notifications will be disabled.',
        );
        return;
      }

      console.log('config', projectId, privateKey, clientEmail);

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }

  async sendMulticastMessage(message: {
    notification: { title: string; body: string };
    data: Record<string, string>;
    tokens: string[];
  }) {
    if (!message.tokens.length) {
      throw new Error('No tokens provided');
    }
    return admin.messaging().sendEachForMulticast(message);
  }
}
