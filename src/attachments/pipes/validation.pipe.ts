import { FileTypeValidator, FileValidator, HttpException, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder } from "@nestjs/common";
import { constants } from "../constants/constants";

export const FileValidationPipe = new ParseFilePipe({
    exceptionFactory: (file) => {
        if(file){     
            throw new HttpException(`The file must be less than ${constants.maxFileSize} bits and one of these file types: ${constants.acceptedTypes.join()}`, 400);
        }
    }
});