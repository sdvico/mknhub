# Firebase Cloud Messaging Setup

## Overview

This project uses Firebase Cloud Messaging (FCM) to send push notifications to users' devices. The system supports multiple platforms (iOS, Android, Web) and includes features like topic-based messaging and device token management.

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Cloud Messaging in the project settings

### 2. Generate Service Account Key

1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file containing your credentials

### 3. Configure Environment Variables

Add the following variables to your `.env` file:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Important**: The `FIREBASE_PRIVATE_KEY` should include the newline characters (`\n`) as shown above.

### 4. Client-Side Setup

#### For Web Applications

```javascript
// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-sender-id',
  appId: 'your-app-id',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: 'your-vapid-key',
    });

    // Send token to your backend
    await sendTokenToServer(token);
  }
}

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
  // Show notification
});
```

#### For Mobile Applications (React Native)

```javascript
import messaging from '@react-native-firebase/messaging';

// Request permission
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    // Send token to your backend
    await sendTokenToServer(token);
  }
}

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  console.log('Message received:', remoteMessage);
  // Show notification
});

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message:', remoteMessage);
});
```

## API Endpoints

### Push Notifications

- `POST /notifications/push/send` - Send notification to authenticated user
- `POST /notifications/push/topic/:topic` - Send notification to topic
- `POST /notifications/push/subscribe/:topic` - Subscribe user to topic
- `DELETE /notifications/push/unsubscribe/:topic` - Unsubscribe user from topic
- `POST /notifications/push/validate-tokens` - Validate and cleanup device tokens
- `POST /notifications/push/test-price-alert` - Test price alert notification

### Device Management

- `POST /users/devices` - Register device
- `GET /users/devices` - Get user devices
- `PUT /users/devices/:id` - Update device
- `DELETE /users/devices/:id` - Remove device

### Follow Management

- `POST /products/follows` - Follow a product
- `GET /products/follows` - Get user follows
- `PUT /products/follows/:id` - Update follow settings
- `DELETE /products/follows/:id` - Unfollow product

## Features

### Automatic Price Alerts

The system automatically sends push notifications when coffee prices change:

- Monitors price changes every hour
- Sends notifications to users following specific products
- Respects user's price threshold settings
- Supports different notification types (increase, decrease, no change)

### Device Token Management

- Automatic validation of device tokens
- Cleanup of invalid tokens
- Support for multiple devices per user
- Platform-specific notification handling

### Topic-Based Messaging

- Subscribe/unsubscribe to topics
- Send notifications to specific topics
- Useful for broadcast messages

### Notification History

- Store all notifications in database
- Track viewed/unviewed status
- Support for different notification types

## Testing

### Test Price Alert

```bash
curl -X POST http://localhost:3000/notifications/push/test-price-alert \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send Custom Notification

```bash
curl -X POST http://localhost:3000/notifications/push/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {
      "type": "test",
      "id": "123"
    }
  }'
```

## Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check if environment variables are set correctly
   - Verify Firebase project ID and credentials

2. **Invalid device tokens**
   - Run token validation: `POST /notifications/push/validate-tokens`
   - Check if tokens are being refreshed on client side

3. **Notifications not received**
   - Verify client-side Firebase setup
   - Check notification permissions
   - Ensure device is registered with valid token

4. **Permission denied errors**
   - Verify service account has proper permissions
   - Check if Firebase project is properly configured

### Debug Logs

Enable debug logging by setting log level in your application:

```typescript
// In main.ts
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'debug', 'log', 'verbose'],
});
```

## Security Considerations

1. **Service Account Security**
   - Keep service account key secure
   - Use environment variables, never commit keys to version control
   - Rotate keys regularly

2. **Token Validation**
   - Validate device tokens before sending notifications
   - Clean up invalid tokens automatically

3. **Rate Limiting**
   - Implement rate limiting for notification endpoints
   - Monitor notification sending frequency

4. **User Consent**
   - Always request user permission before sending notifications
   - Provide opt-out mechanisms
   - Respect user notification preferences
