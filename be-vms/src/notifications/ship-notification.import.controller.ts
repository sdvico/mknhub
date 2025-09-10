import {
  BadRequestException,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import * as iconv from 'iconv-lite';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequiresApiKey } from '../auth/decorators/api-key.decorator';
import { ApiKeyOnly } from '../auth/decorators/api-key-only.decorator';
import { ShipNotificationService } from './ship-notification.service';
import { SendShipNotificationDto } from './dto/ship-notification.dto';

type ImportRow = Partial<SendShipNotificationDto> & {
  boundary_crossed?: any;
  boundary_near_warning?: any;
  lat?: any;
  lng?: any;
};

@ApiTags('Ship Notifications Import')
@Controller('v1/ship-notifications-import')
@UseGuards(AuthGuard)
export class ShipNotificationImportController {
  constructor(
    private readonly shipNotificationService: ShipNotificationService,
  ) {}

  @ApiBearerAuth()
  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
  })
  @Post('excel')
  @ApiOperation({ summary: 'Import ship notifications from Excel/CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Import summary',
    schema: {
      example: {
        total: 2,
        success: 2,
        failed: 0,
        errors: [],
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file?.buffer) throw new BadRequestException('File is required');
    let wb: XLSX.WorkBook;

    if (file.originalname?.toLowerCase().endsWith('.csv')) {
      // Try UTF-8 first
      let decoded = iconv.decode(file.buffer, 'utf8');
      // If there are many � characters, fallback to cp1258 (Vietnamese Windows)
      const replacementCount = (decoded.match(/�/g) || []).length;
      if (replacementCount > 0) {
        decoded = iconv.decode(file.buffer, 'cp1258');
      }
      wb = XLSX.read(decoded, { type: 'string' });
    } else {
      wb = XLSX.read(file.buffer, { type: 'buffer' });
    }
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<ImportRow>(sheet, { defval: '' });

    const result: {
      total: number;
      success: number;
      failed: number;
      records: Array<{
        row: number;
        imported: boolean;
        error?: string;
        clientReq: string;
        ship_code: string;
        occurred_at: string;
        type: string;
        requestId?: string;
        status?: string;
      }>;
    } = {
      total: rows.length,
      success: 0,
      failed: 0,
      records: [] as Array<{
        row: number;
        imported: boolean;
        error?: string;
        clientReq: string;
        ship_code: string;
        occurred_at: string;
        type: string;
        requestId?: string;
        status?: string;
      }>,
    };

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const dto: SendShipNotificationDto = {
        // Server generates clientReq for each row
        clientReq: uuidv4(),
        ship_code: String(r.ship_code || '').trim(),
        occurred_at: String(r.occurred_at || '').trim(),
        content: String(r.content || '').trim(),
        owner_name: String(r.owner_name || '').trim(),
        owner_phone: String(r.owner_phone || '').trim(),
        type: String(r.type || '').trim() as any,
        boundary_status_code: r.boundary_status_code
          ? String(r.boundary_status_code)
          : undefined,
        lat: this.toNum(r.lat),
        lng: this.toNum(r.lng),
        agent_code: r.agent_code ? String(r.agent_code) : undefined,
      };

      try {
        const resp = await this.shipNotificationService.sendShipNotification(
          dto,
          req.user,
          true,
        );
        result.success++;
        result.records.push({
          row: i + 2,
          imported: true,
          clientReq: dto.clientReq,
          ship_code: dto.ship_code,
          occurred_at: dto.occurred_at,
          type: String(dto.type),
          requestId: (resp as any)?.requestId,
          status: (resp as any)?.status,
        });
      } catch (e: any) {
        result.failed++;
        result.records.push({
          row: i + 2,
          imported: false,
          error: e?.message || 'Invalid row',
          clientReq: dto.clientReq,
          ship_code: dto.ship_code,
          occurred_at: dto.occurred_at,
          type: String(dto.type),
        });
      }
    }

    return result;
  }

  private toBool(v: any): boolean | undefined {
    if (v === '' || v === undefined || v === null) return undefined;
    const s = String(v).toLowerCase().trim();
    if (['true', '1', 'yes', 'y'].includes(s)) return true;
    if (['false', '0', 'no', 'n'].includes(s)) return false;
    return undefined;
  }

  private toNum(v: any): number | undefined {
    if (v === '' || v === undefined || v === null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
}
