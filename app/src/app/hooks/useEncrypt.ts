import AsyncStorage from '@react-native-async-storage/async-storage';
import {SET_LISTSMSGET} from '../features/chat/redux/constants';

/* eslint-disable no-bitwise */
export const asciiString =
  '[]^_ "!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}~';

export function encryptMessage(message: string): number[] {
  const byteArray: number[] = [];
  for (const char of message) {
    const index = asciiString.indexOf(char);
    if (index !== -1) {
      byteArray.push(index + 32);
    }
  }
  return byteArray;
}

export function decryptMessage(byteArray: number[]): string {
  let message = '';
  for (const byte of byteArray) {
    const index = byte - 32;
    if (index >= 0 && index < asciiString.length) {
      message += asciiString[index];
    } else {
      throw new Error(`Byte value "${byte}" is out of range`);
    }
  }
  return message;
}

export const convertBase64BigEndian = (
  sender: number,
  receiver: number,
  block: number,
  msg: string,
): string => {
  const listByte = [];

  // Convert sender to bytes (2 bytes, big-endian)
  listByte.push((sender >> 8) & 0xff); // High byte
  listByte.push(sender & 0xff); // Low byte

  // Convert receiver to bytes (2 bytes, big-endian)
  listByte.push((receiver >> 8) & 0xff); // High byte
  listByte.push(receiver & 0xff); // Low byte

  // Convert block to bytes (1 byte)
  listByte.push(block);

  // Encrypt the message
  const msgEncrypt = encryptMessage(msg);
  listByte.push(...msgEncrypt);

  console.info('msgEncrypt', msgEncrypt);
  console.info('listByte', listByte);
  // Convert to Base64
  const base64String = btoa(String.fromCharCode(...listByte));
  return base64String;
};

export const decodeBase64Message = (base64Str: string) => {
  // Convert base64 to byte array
  const bytes = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));

  // Extract sender (first 2 bytes, big-endian)
  const sender = (bytes[0] << 8) | bytes[1];

  // Extract receiver (next 2 bytes, big-endian)
  const receiver = (bytes[2] << 8) | bytes[3];

  // Extract block (1 byte)
  const block = bytes[4];

  // Extract encrypted message (remaining bytes)
  const encryptedMsg = Array.from(bytes.slice(5));

  // Decrypt message
  const text = decryptMessage(encryptedMsg);

  return {
    sender,
    receiver,
    block,
    text,
  };
};

export const convertBase64BigEndianWithoutEncryption = (
  sender: number,
  receiver: number,
  block: number,
  msg: string,
): string => {
  const listByte = [];

  // Convert sender to bytes (2 bytes, big-endian)
  listByte.push((sender >> 8) & 0xff); // High byte
  listByte.push(sender & 0xff); // Low byte

  // Convert receiver to bytes (2 bytes, big-endian)
  listByte.push((receiver >> 8) & 0xff); // High byte
  listByte.push(receiver & 0xff); // Low byte

  // Convert block to bytes (1 byte)
  listByte.push(block);

  // Convert the original message to bytes
  const msgBytes = Array.from(msg).map(char => char.charCodeAt(0));
  listByte.push(...msgBytes);

  console.info('msgBytes', msgBytes);
  console.info('listByte', listByte);
  // Convert to Base64
  const base64String = btoa(String.fromCharCode(...listByte));
  return base64String;
};

export const decodeBase64MessageWithoutDecryption = (base64Str: string) => {
  // Convert base64 to byte array
  const bytes = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));

  // Extract sender (first 2 bytes, big-endian)
  const sender = (bytes[0] << 8) | bytes[1];

  // Extract receiver (next 2 bytes, big-endian)
  const receiver = (bytes[2] << 8) | bytes[3];

  // Extract block (1 byte)
  const block = bytes[4];

  // Extract original message (remaining bytes)
  const originalMsg = Array.from(bytes.slice(5))
    .map(byte => String.fromCharCode(byte))
    .join('');

  return {
    sender,
    receiver,
    block,
    text: originalMsg,
  };
};

export function encryptMessageToString(message: string): string {
  let encryptedString = '';
  for (const char of message) {
    const index = asciiString.indexOf(char);
    if (index !== -1) {
      encryptedString += String.fromCharCode(index + 32);
    }
    // If character is not found, it is bypassed
  }
  return encryptedString;
}

export function decryptMessageFromString(encryptedString: string): string {
  let message = '';
  for (const char of encryptedString) {
    const index = char.charCodeAt(0) - 32;
    if (index >= 0 && index < asciiString.length) {
      message += asciiString[index];
    } else {
      throw new Error(`Character "${char}" is out of range`);
    }
  }
  return message;
}

// Define interfaces for the processed messages
interface ProcessedMessage {
  senderId: number;
  receiverId: number;
  blockCount: number;
  rawMessage: string;
  decryptedMessage: string;
  originalMessage: string;
  error?: undefined;
}

interface ErrorMessage {
  error: true;
  rawMessage: string;
  errorMessage: string;
  originalMessage: string;
  senderId?: undefined;
  receiverId?: undefined;
  blockCount?: undefined;
  decryptedMessage?: undefined;
}

function extractCleanMessages(
  rawStorageData: string | null | undefined,
): string[] {
  if (!rawStorageData) {
    return [];
  }

  // For debugging
  console.info('Raw storage data type:', typeof rawStorageData);

  try {
    // First try a direct parse
    let parsedData = JSON.parse(rawStorageData);

    // If it's already an array, great!
    if (Array.isArray(parsedData)) {
      return parsedData.map(item =>
        typeof item === 'string' ? item.replace(/\\+/g, '\\') : String(item),
      );
    }

    // If it's a string that looks like an array, parse it again
    if (
      typeof parsedData === 'string' &&
      parsedData.startsWith('[') &&
      parsedData.endsWith(']')
    ) {
      try {
        parsedData = JSON.parse(parsedData);
        if (Array.isArray(parsedData)) {
          return parsedData.map(item =>
            typeof item === 'string'
              ? item.replace(/\\+/g, '\\')
              : String(item),
          );
        }
      } catch (e) {
        console.error('Failed to parse string array:', e);
      }
    }

    // Last resort: manually extract strings from the JSON-like structure
    // This regex looks for quoted strings within an array structure
    const stringExtractRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    const matches = [];
    let match;

    // Extract all quoted strings
    while ((match = stringExtractRegex.exec(rawStorageData)) !== null) {
      if (match[1] && match[1].length > 8) {
        // Basic validation - message should be long enough
        // Fix escape sequences
        const cleanedString = match[1]
          .replace(/\\\\+/g, '\\') // Fix multiple backslashes
          .replace(/\\"/g, '"'); // Fix escaped quotes
        matches.push(cleanedString);
      }
    }

    return matches;
  } catch (e) {
    console.error('Failed to parse storage data:', e);

    // If all else fails, attempt to extract quoted strings directly
    const stringExtractRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    const matches = [];
    let match;

    while ((match = stringExtractRegex.exec(rawStorageData)) !== null) {
      if (match[1] && match[1].length > 8) {
        const cleanedString = match[1]
          .replace(/\\\\+/g, '\\')
          .replace(/\\"/g, '"');
        matches.push(cleanedString);
      }
    }

    return matches;
  }
}

// Modified validation function that doesn't rely on specific message format
function isValidMessage(message: string): boolean {
  // Check if the message has a reasonable length (at least 8 chars for metadata + content)
  if (!message || message.length < 9) {
    return false;
  }

  // Check if it's a single character that was split incorrectly
  if (message.length === 1) {
    return false;
  }

  // Check if it looks like an array character or JSON fragment
  const invalidCharacters = ['[', ']', '{', '}', '"', ','];
  if (invalidCharacters.includes(message)) {
    return false;
  }

  // Check if the message starts with a valid Base64 pattern (8 chars)
  // Base64 uses A-Z, a-z, 0-9, +, /, and = for padding
  const firstEightChars = message.substring(0, 8);
  const isValidBase64Pattern = /^[A-Za-z0-9+/=]{8}/.test(firstEightChars);

  return isValidBase64Pattern;
}

export async function processDecryptedMessages(
  base64DecodedString: string,
): Promise<(ProcessedMessage | ErrorMessage)[]> {
  // Get stored data
  const storedData = await AsyncStorage.getItem('persist:chat');
  let storedMessageList: string[] = [];

  try {
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      if (parsedData.listSMSGet) {
        // Extract clean messages using our new function
        storedMessageList = extractCleanMessages(parsedData.listSMSGet);
        console.info(
          'Extracted stored messages count:',
          storedMessageList.length,
        );
        if (storedMessageList.length > 0) {
          console.info(
            'First few stored messages:',
            storedMessageList.slice(0, 3),
          );
        }
      }
    }
  } catch (error) {
    console.error('Error retrieving stored messages:', error);
    storedMessageList = [];
  }

  // Split incoming messages by line
  const receivedMessages = base64DecodedString.trim().split('\n');
  console.info('Received messages count:', receivedMessages.length);
  if (receivedMessages.length > 0) {
    console.info('First few received messages:', receivedMessages.slice(0, 3));
  }

  // Filter out invalid messages and normalize them for comparison
  const validReceivedMessages = receivedMessages
    .filter(msg => isValidMessage(msg))
    .map(msg => msg.trim());

  console.info('Valid received messages count:', validReceivedMessages.length);

  // Create a helper function for normalized message comparison
  function normalizeForComparison(msg: string): string {
    return msg.trim().replace(/\\+/g, '\\');
  }

  // Filter out messages that already exist
  const existingMessagesSet = new Set(
    storedMessageList.map(msg => normalizeForComparison(msg)),
  );

  const newMessages = validReceivedMessages.filter(
    msg => !existingMessagesSet.has(normalizeForComparison(msg)),
  );

  console.info('New messages to process count:', newMessages.length);
  if (newMessages.length > 0) {
    console.info('First few new messages:', newMessages.slice(0, 3));
  }

  if (newMessages.length === 0) {
    console.info('No new messages to process');
    return [];
  }

  // Process the new messages
  const processedMessages = newMessages.map(message => {
    // Split the first 8 characters (containing metadata) from the message content
    const metadataBase64 = message.substring(0, 8);
    const messageText = message.substring(8);

    console.info(`Processing message: ${message}`);
    console.info(`Metadata Base64: ${metadataBase64}, Message: ${messageText}`);

    try {
      // Convert the Base64 metadata to hex
      let metadataHex = '';
      try {
        // Convert Base64 to binary, then to hex
        const binaryData = atob(metadataBase64);
        for (let i = 0; i < binaryData.length; i++) {
          const hex = binaryData.charCodeAt(i).toString(16).padStart(2, '0');
          metadataHex += hex;
        }
      } catch (e) {
        console.error('Error converting Base64 to hex:', e);
        metadataHex = '';
      }

      console.info(`Metadata Hex: ${metadataHex}`);

      // Extract and convert the sender ID (first 2 bytes, little-endian to big-endian)
      let senderId = 0;
      if (metadataHex.length >= 4) {
        // Convert little-endian to big-endian and parse as decimal
        const senderIdHex = metadataHex.substring(0, 4);
        const senderIdBigEndian =
          senderIdHex.substring(2, 4) + senderIdHex.substring(0, 2);
        senderId = parseInt(senderIdBigEndian, 16);
      }

      // Extract and convert the receiver ID (next 2 bytes, little-endian to big-endian)
      let receiverId = 0;
      if (metadataHex.length >= 8) {
        // Convert little-endian to big-endian and parse as decimal
        const receiverIdHex = metadataHex.substring(4, 8);
        const receiverIdBigEndian =
          receiverIdHex.substring(2, 4) + receiverIdHex.substring(0, 2);
        receiverId = parseInt(receiverIdBigEndian, 16);
      }

      // Extract block count (last byte)
      let blockCount = 0;
      if (metadataHex.length >= 10) {
        blockCount = parseInt(metadataHex.substring(8, 10), 16);
      }

      console.info(
        `Sender ID: ${senderId}, Receiver ID: ${receiverId}, Block Count: ${blockCount}`,
      );

      // Decrypt the message content using the provided function
      let decryptedText = '';
      try {
        // Convert message to byte array for decryption
        const byteArray = messageText.split('').map(char => char.charCodeAt(0));
        decryptedText = decryptMessage(byteArray);
      } catch (e) {
        console.error('Error decrypting message:', e);
        decryptedText = 'Error: Could not decrypt message';
      }

      return {
        senderId,
        receiverId,
        blockCount,
        rawMessage: messageText,
        decryptedMessage: decryptedText,
        originalMessage: message,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        error: true as const,
        rawMessage: message,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        originalMessage: message,
      };
    }
  });

  // Combine stored messages with new messages
  const combinedMessages = [...storedMessageList, ...newMessages];

  // Create a set of normalized messages for deduplication
  const normalizedSet = new Set();
  const uniqueMessages: string[] = [];

  for (const msg of combinedMessages) {
    const normalized = normalizeForComparison(msg);
    if (!normalizedSet.has(normalized)) {
      normalizedSet.add(normalized);
      uniqueMessages.push(msg);
    }
  }

  console.info('Final unique messages count:', uniqueMessages.length);

  try {
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      // Store directly as a simple JSON array
      parsedData.listSMSGet = JSON.stringify(uniqueMessages);
      await AsyncStorage.setItem('persist:chat', JSON.stringify(parsedData));

      // Update Redux
      const {store} = require('../store/store');
      store.dispatch({
        type: SET_LISTSMSGET,
        payload: uniqueMessages,
      });

      console.info('Successfully updated storage with message list');
    }
  } catch (error) {
    console.error('Error updating storage with message list:', error);
  }

  return processedMessages;
}
