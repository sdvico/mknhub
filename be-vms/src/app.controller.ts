import { Controller, Get, Req, Res } from '@nestjs/common';
import { join } from 'path';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get('*') // fallback cho SPA, sẽ filter trong handler
  renderApp(@Req() req: Request, @Res() res: Response) {
    const accept = (req.headers['accept'] as string) || '';
    const url = req.url || '';
    // Bỏ qua /api và các static path
    if (url.startsWith('/api')) {
      return true;
    }
    // Nếu client mong đợi JSON, trả 404 JSON thay vì index.html
    if (accept.includes('application/json')) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }
    res.sendFile(join(__dirname, '..', 'client', 'index.html'));
  }
}
