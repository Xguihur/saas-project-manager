import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { REQUEST_ID_HEADER } from '../../common/request-id.middleware';

@ApiTags('system')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: '检查 API 是否已启动' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  getHealth(@Req() request: Request) {
    return {
      status: 'ok',
      service: 'backend',
      timestamp: new Date().toISOString(),
      requestId: request.header(REQUEST_ID_HEADER) ?? null,
    };
  }
}
