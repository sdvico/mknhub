import { SetMetadata } from '@nestjs/common';

export const API_KEY_ONLY = 'apiKeyOnly';
export const ApiKeyOnly = () => SetMetadata(API_KEY_ONLY, true);
