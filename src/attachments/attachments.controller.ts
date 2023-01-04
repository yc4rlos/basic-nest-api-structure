import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Res, UploadedFile } from '@nestjs/common/decorators';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { AttachmentDto } from './dto/attachment.dto';
import { FileValidationPipe } from './pipes/validation.pipe';

@Controller('attachments')
@ApiTags('Attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttachmentsController {
  constructor(private readonly _AttachmentsService: AttachmentsService) { }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiResponse({ status: 200, description: 'Attachments and files registered with success.', type: [AttachmentDto] })
  @ApiResponse({ status: 400, description: 'Provided invalid data or file.' })
  @ApiParam({type: '[file]', name: 'files', description: 'Array of Files to upload'})
  @ApiConsumes('multipart/form-data')
  createMultiple(@UploadedFiles(FileValidationPipe) files: Express.Multer.File[]) {
    let createAttachmentDto = [];
    files.forEach((file) => {
      createAttachmentDto.push({
        fileName: file.filename,
        originalName: file.originalname
      })
    })
    return this._AttachmentsService.createMultiple(createAttachmentDto);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Attachment and file registered with success.', type: AttachmentDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data or file.' })
  @ApiParam({type: 'file', name: 'file', description: 'File to upload'})
  @ApiConsumes('multipart/form-data')
  create(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    const createAttachmentDto = {
      fileName: file.filename,
      originalName: file.originalname
    };

    return this._AttachmentsService.create(createAttachmentDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Attachments getted with success.', type: [AttachmentDto] })
  findAll() {
    return this._AttachmentsService.findAll();
  }

  @Get('/download/:name')
  @ApiResponse({ status: 200, description: 'Attachments recived with success.' })
  @ApiResponse({ status: 400, description: 'Invalid file name.' })
  getAttachment(@Param('name') name: string, @Res() res: Response) {
    console.log(process.cwd());

    const file = createReadStream(join(process.cwd()) + '/uploads/' + name);
    file.pipe(res);
  }


  @Get(':id')
  @ApiResponse({ status: 200, description: 'Attachments getted with success.', type: AttachmentDto })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  findOne(@Param('id') id: string) {
    return this._AttachmentsService.findOne(+id);
  }

  @Patch('/restore/:id')
  @ApiResponse({ status: 200, description: 'Attachment restored with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  restore(@Param('id', ParseIntPipe) id: string) {
    return this._AttachmentsService.restore(+id);
  }

  @Patch('/:id')
  @ApiResponse({ status: 200, description: 'Attachment and file updated with success.', type: AttachmentDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data, file or ID.' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({type: 'file', name: 'file', description: 'File to upload'})
  @ApiConsumes('multipart/form-data')
  update(@Param('id', ParseIntPipe) id: string, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {

    const updateAttachmentDto = {
      fileName: file.filename,
      originalName: file.originalname
    };

    return this._AttachmentsService.update(+id, updateAttachmentDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Attachment deleted with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this._AttachmentsService.remove(+id);
  }
}
