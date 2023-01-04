import { Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Repository } from 'typeorm';
import { AttachmentDto } from './dto/attachment.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AttachmentsService {

  constructor(
    @InjectRepository(Attachment) private readonly _attachmentRepository: Repository<Attachment>
  ) { }

  async createMultiple(createAttachmentDto: CreateAttachmentDto[]) {
    let result = [];
    for (let createAttachment of createAttachmentDto) {
      const attachment = this._attachmentRepository.create(createAttachment);
      result.push(await this._attachmentRepository.save(attachment));
    }
    return result;
  }

  async create(createAttachmentDto: CreateAttachmentDto) {
    const attachment = await this._attachmentRepository.create(createAttachmentDto);
    return this._attachmentRepository.save(attachment);
  }

  findAll(): Promise<AttachmentDto[]> {
    return this._attachmentRepository.find();
  }

  findOne(id: number): Promise<AttachmentDto> {
    return this._attachmentRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto): Promise<AttachmentDto> {

    const oldFile = await this.findOne(id);

    if (oldFile) {
      fs.unlink(join(process.cwd()) + '/uploads/' + oldFile.fileName, (err) => {
        if(err){
          console.log("Could not delete the file. Error:", err);
        }
      });
    }

    await this._attachmentRepository.update(id, updateAttachmentDto);

    return this.findOne(id);
  }

  remove(id: number) {
    return this._attachmentRepository.softDelete(id);
  }

  restore(id: number) {
    return this._attachmentRepository.restore(id);
  }
}
