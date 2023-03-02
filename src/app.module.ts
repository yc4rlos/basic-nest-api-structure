import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { config } from './config/config';

@Module({
  imports: [
    // Setup config files
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),

    // TypeOrm Config
    TypeOrmModule.forRoot({
      ...config().database,
      type: 'postgres',
      port: 5432,
      synchronize: true,
      autoLoadEntities: true
    }),

    // Node Mailer Config
    MailerModule.forRoot({
      transport: {
        ...config().mail,
        ignoreTLS: true,
        secure: false,
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      }
    }),

    // Rate Limiting
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 3
    }),

    // Winston Config

    WinstonModule.forRoot({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
        ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: 'error-log.json', level: 'error' })
      ]
    }),

    UsersModule,
    AuthModule,
    AttachmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
