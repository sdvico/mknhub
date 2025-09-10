import { PartialType } from '@nestjs/mapped-types';
import { CreateWeatherReportDto } from './create-weather-report.dto';

export class UpdateWeatherReportDto extends PartialType(
  CreateWeatherReportDto,
) {}
