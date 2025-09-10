import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '../entities/report.entity';

export class CreateReportResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Report created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created report data',
    example: {
      id: '57B49DE2-4C82-47F7-9D47-9F28349661C9',
      lat: 10.762622,
      lng: 106.660172,
      reported_at: '2024-01-01T10:30:00.000Z',
      status: ReportStatus.PENDING,
      port_code: 'VNSGN',
      description: 'Ship encountered rough weather conditions',
      reporter_user_id: '57B49DE2-4C82-47F7-9D47-9F28349661C7',
      reporter_ship_id: '57B49DE2-4C82-47F7-9D47-9F28349661C8',
      created_at: '2024-01-01T10:30:00.000Z',
      updated_at: '2024-01-01T10:30:00.000Z',
    },
  })
  data: {
    id: string;
    lat: number;
    lng: number;
    reported_at: Date;
    status: ReportStatus;
    port_code?: string;
    description?: string;
    reporter_user_id?: string;
    reporter_ship_id?: string;
    created_at: Date;
    updated_at: Date;
  };
}
