import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Repository } from 'typeorm';
import { AttachmentDto } from './dto/attachment.dto';
import * as fs from 'fs';
import { join } from 'path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AttachmentsService {

  constructor(
    @InjectRepository(Attachment) private readonly _attachmentRepository: Repository<Attachment>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) { }

  async createMultiple(createAttachmentDto: CreateAttachmentDto[]) {
    try{
    let result = [];
    for (let createAttachment of createAttachmentDto) {
      const attachment = await this._attachmentRepository.create(createAttachment);
      result.push(await this._attachmentRepository.save(attachment));
    }
    return result;
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }

  async create(createAttachmentDto: CreateAttachmentDto) {
    try{
      const attachment = await this._attachmentRepository.create(createAttachmentDto);
      return await this._attachmentRepository.save(attachment);
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<AttachmentDto[]> {
    try{
      return await this._attachmentRepository.find();
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<AttachmentDto> {
    try{
      return await this._attachmentRepository.findOne({ where: { id } });
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto): Promise<AttachmentDto> {

    try{
      const oldFile = await this.findOne(id);

      if (oldFile) {
        fs.unlink(join(process.cwd()) + '/uploads/' + oldFile.fileName, (err) => {
          if(err){
            this.logger.error("Could not delete the old file. Error:" + err.message, "AttachmentsService" );
          }
        });
      }

      await this._attachmentRepository.update(id, updateAttachmentDto);

      return await this.findOne(id);
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try{
      return await this._attachmentRepository.softDelete(id);
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }

  async restore(id: number) {
    try{
      return await this._attachmentRepository.restore(id);
    }catch(err){
      this.logger.error(err.message, "AttachmmentsService");
      throw new InternalServerErrorException();
    }
  }
}
