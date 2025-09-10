# Pepper Price Cronjob

## Overview

This cronjob automatically fetches pepper prices from giatieu.com every 6 hours and stores them in the database. It includes push notifications for price changes.

## Features

- ⏰ Runs every 6 hours automatically
- 🌶️ Fetches pepper prices for different regions in Vietnam
- 💾 Stores price data in PostgreSQL database
- 📱 Sends push notifications on price changes
- 🔄 Manual trigger via API endpoint

## API Configuration

- **Source**: https://giatieu.com/gia-tieu-hom-nay/
- **Scraper API**: https://tool.giacaphevietnam.com/api/common/get-data-from-url
- **Product Code**: TIEU
- **Table ID**: pepper_domestic

## Database Structure

The cronjob creates and uses:

- **Product**: `TIEU` (Tiêu) with country Vietnam
- **Product Prices**: Regional pepper prices with change tracking
- **Notifications**: Price change alerts for followed products

## Manual Testing

You can manually trigger the pepper price fetch:

```bash
# Via HTTP API
curl -X POST http://localhost:3000/api/v1/pepper-price/fetch-now

# Response example
{
  "success": true,
  "message": "Pepper prices fetched and saved successfully"
}
```

## Cron Schedule

- **Frequency**: Every 6 hours (`@Cron(CronExpression.EVERY_6_HOURS)`)
- **Auto-start**: Yes (when application starts)

## Data Format

### Source Data (from giatieu.com):

```json
{
  "khu_vuc": "Gia Lai",
  "gia": "136,500",
  "thay_doi": "0",
  "thoi_gian_cap_nhat": ""
}
```

### Stored Data:

- **Province**: Region name (e.g., "Gia Lai", "Đắk Lắk")
- **Price**: Numeric price in VND (e.g., 136500)
- **Change**: Price change indicator ("+1000", "-500", "0")
- **Change Type**: INCREASE, DECREASE, NO_CHANGE
- **Unit**: kg
- **Currency**: VND

## Notifications

Push notifications are sent when:

- Price increases in followed regions
- Price decreases in followed regions
- Users have enabled price alerts for pepper

## Setup

1. Ensure the pepper product exists:

```bash
npm run seed:run:relational
```

2. Start the application:

```bash
npm run start:dev
```

3. The cronjob will start automatically and run every 6 hours.

## Monitoring

Check application logs for cronjob status:

```
[PepperPriceCronService] Starting pepper price cronjob...
[PepperPriceCronService] Saved pepper price for Gia Lai: 136500 VND (0)
[PepperPriceCronService] Pepper price data processed successfully
```

## Related Files

- `src/products/pepper-price-cron.service.ts` - Main cronjob service
- `src/products/pepper-price.controller.ts` - Manual trigger API
- `src/products/dto/pepper-price-api.dto.ts` - API response types
- `src/database/seeds/relational/coffee/coffee-seed.service.ts` - Seeds TIEU product
