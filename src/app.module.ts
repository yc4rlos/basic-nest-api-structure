import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    // Setup config files
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),

    // TypeOrm Config
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),

    // Node Mailer Config
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAILUSER,
          pass: process.env.MAILPASSWORD,
        },
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
    
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
