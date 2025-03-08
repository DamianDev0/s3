import { Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleAiModule } from './google-ai/google-ai.module';

@Module({
  imports: [S3Module, ConfigModule.forRoot({ isGlobal: true }), GoogleAiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
