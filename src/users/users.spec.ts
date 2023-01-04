import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { INestApplication } from '@nestjs/common';
import { User } from './entities/user.entity';
import { providerConnection } from '../../test/database/providerConnection';
import * as request from 'supertest';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer/dist';

describe('UsersController', () => {
  let app: INestApplication;
  let createdUser: UserDto;

  beforeAll(async () => {

    const databaseProviders = await providerConnection([User]);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailerModule.forRoot({
          transport: {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            ignoreTLS: true,
            secure: false,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          }
        })
      ],
      controllers: [UsersController],
      providers: [UsersService, MailService, ...databaseProviders],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/Post Create User', () => {
    const user: CreateUserDto = {
      name: "username",
      email: "user@email.com",
      password: "AnStr0ngPassw00rd!@#$"
    };

    return request(app.getHttpServer()).post('/users').send(user).expect(201).then(resp => {
      createdUser = JSON.parse(resp.text);
    });
  });

  it('/Get Get Users', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect([createdUser]);
  });

  it('/Patch Update User', () => {
    const newValues: UpdateUserDto = {
      name: "updatedUsername",
      email: 'updated@mail.com'
    }

    return request(app.getHttpServer()).patch('/users/1').send(newValues).expect(200).expect(resp => {
      let { updated_at, ...oldUserData } = createdUser;
      const values = JSON.parse(resp.text);

      delete values.updated_at;

      return JSON.stringify(values) === JSON.stringify({ ...oldUserData, newValues });
    });
  });

  it('/Delete Delete User', () => {
    return request(app.getHttpServer()).delete('/users/1').expect(200).expect({ "generatedMaps": [], "raw": [], "affected": 1 })
  })

  it('/Patch Testore User', () => {
    return request(app.getHttpServer()).patch('/users/restore/1').expect(200).expect({ "generatedMaps": [], "raw": [], "affected": 1 });
  })

  afterAll(async () => {
    await app.close();
  });
});
