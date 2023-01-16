import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Logger, InternalServerErrorException } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Inject, Res, UploadedFile } from '@nestjs/common/decorators';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { AttachmentDto } from './dto/attachment.dto';
import { FileValidationPipe } from './pipes/validation.pipe';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('attachments')
@ApiTags('Attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttachmentsController {
  constructor(
    private readonly _AttachmentsService: AttachmentsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) { }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiResponse({ status: 200, description: 'Attachments and files registered with success.', type: [AttachmentDto] })
  @ApiResponse({ status: 400, description: 'Provided invalid data or file.' })
  @ApiParam({ type: '[file]', name: 'files', description: 'Array of Files to upload' })
  @ApiConsumes('multipart/form-data')
  async createMultiple(@UploadedFiles(FileValidationPipe) files: Express.Multer.File[]) {
    try {

      let createAttachmentDto = [];
      files.forEach((file) => {
        createAttachmentDto.push({
          fileName: file.filename,
          originalName: file.originalname
        })
      })
      return await this._AttachmentsService.createMultiple(createAttachmentDto);

    } catch (err) {

      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Attachment and file registered with success.', type: AttachmentDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data or file.' })
  @ApiParam({ type: 'file', name: 'file', description: 'File to upload' })
  @ApiConsumes('multipart/form-data')
  async create(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    try {

      const createAttachmentDto = {
        fileName: file.filename,
        originalName: file.originalname
      };
      return await this._AttachmentsService.create(createAttachmentDto);

    } catch (err) {

      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Attachments getted with success.', type: [AttachmentDto] })
  async findAll() {
    try {
      return await this._AttachmentsService.findAll();

    } catch (err) {

      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }

  @Get('/download/:name')
  @ApiResponse({ status: 200, description: 'Attachments recived with success.' })
  @ApiResponse({ status: 400, description: 'Invalid file name.' })
  getAttachment(@Param('name') name: string, @Res() res: Response) {
    try {


      const file = createReadStream(join(process.cwd()) + '/uploads/' + name);
      file.pipe(res);
    } catch (err) {
      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }


  @Get(':id')
  @ApiResponse({ status: 200, description: 'Attachments getted with success.', type: AttachmentDto })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this._AttachmentsService.findOne(+id);

    } catch (err) {

      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }

  @Patch('/restore/:id')
  @ApiResponse({ status: 200, description: 'Attachment restored with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  async restore(@Param('id', ParseIntPipe) id: string) {
    try {
      return await this._AttachmentsService.restore(+id);

    } catch (err) {

      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }

  @Patch('/:id')
  @ApiResponse({ status: 200, description: 'Attachment and file updated with success.', type: AttachmentDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data, file or ID.' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ type: 'file', name: 'file', description: 'File to upload' })
  @ApiConsumes('multipart/form-data')
  async update(@Param('id', ParseIntPipe) id: string, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    try {

      const updateAttachmentDto = {
        fileName: file.filename,
        originalName: file.originalname
      };

      return await this._AttachmentsService.update(+id, updateAttachmentDto);
    } catch (err) {

      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Attachment deleted with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  async remove(@Param('id', ParseIntPipe) id: string) {
    try {
      return await this._AttachmentsService.remove(+id);
    } catch (err) {
      
      this.logger.log(err.message, AttachmentsController.name);
      throw new InternalServerErrorException();
    }
  }
}
