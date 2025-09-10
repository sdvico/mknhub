import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../../session/session.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { REQUIRES_API_KEY } from '../decorators/api-key.decorator';
import { API_KEY_ONLY } from '../decorators/api-key-only.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra @Public decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Kiểm tra @RequiresApiKey decorator
    const requiresApiKey = this.reflector.getAllAndOverride<boolean>(
      REQUIRES_API_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu API yêu cầu x-api-key, kiểm tra header này trước
    if (requiresApiKey) {
      const apiKey = request.headers['x-api-key'];
      if (!apiKey) {
        throw new UnauthorizedException('x-api-key header is required');
      }

      // Kiểm tra x-api-key có hợp lệ không (có thể cấu hình trong env hoặc config)
      const validApiKey = process.env.API_KEY || 'your-secret-api-key';
      if (apiKey !== validApiKey) {
        throw new UnauthorizedException('Invalid x-api-key');
      }

      // Nếu chỉ cần x-api-key (không cần auth token), return true
      const isApiKeyOnly = this.reflector.getAllAndOverride<boolean>(
        API_KEY_ONLY,
        [context.getHandler(), context.getClass()],
      );

      if (isApiKeyOnly) {
        return true;
      }
    }

    // Kiểm tra authorization header cho các API cần authentication
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    // Find session by token
    const session = await this.sessionService.findByToken(token);
    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    // Check if token is expired
    if (session.expired_date < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    // Add user to request
    request.user = session.user;
    request.session = session;

    return true;
  }
}
