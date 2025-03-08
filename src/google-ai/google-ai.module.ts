import { Module } from '@nestjs/common';
import { GoogleAiService } from './google-ai.service';
import { GoogleAiController } from './google-ai.controller';

@Module({
  providers: [GoogleAiService],
  controllers: [GoogleAiController],
})
export class GoogleAiModule {}
