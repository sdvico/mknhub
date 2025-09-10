import { ApiProperty } from '@nestjs/swagger';

export class CreateWeatherReportResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Weather report created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created weather report data',
    example: {
      id: '57B49DE2-4C82-47F7-9D47-9F28349661C9',
      region: 'Ho Chi Minh City',
      summary: 'Partly cloudy with occasional rain showers',
      advice: 'Mariners should exercise caution due to reduced visibility',
      link: 'https://weather.gov.vn/ho-chi-minh-city',
      total_views: 0,
      total_clicks: 0,
      enable: true,
      published_at: '2024-01-01T10:30:00.000Z',
      created_at: '2024-01-01T10:30:00.000Z',
      updated_at: '2024-01-01T10:30:00.000Z',
    },
  })
  data: {
    id: string;
    region: string;
    summary: string;
    advice?: string;
    link?: string;
    total_views: number;
    total_clicks: number;
    enable: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
  };
}
