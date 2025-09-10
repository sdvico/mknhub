import { SetMetadata } from '@nestjs/common';

export const REQUIRES_API_KEY = 'requiresApiKey';
export const RequiresApiKey = () => SetMetadata(REQUIRES_API_KEY, true);
