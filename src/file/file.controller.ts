import { Controller, HttpException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('file')
export class FileController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            // filename: (req, file, callback) => {
            //     // Keep the original file extension
            //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            //     const ext = extname(file.originalname); // Get the original file extension
            //     const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            //     callback(null, filename);
            // },
            filename: (req, file, callback) => {
                // Use the original filename with its extension
                callback(null, file.originalname);
            },

        }),
    })) uploadFile(@UploadedFile() file) {
        if (!file) {
            throw new HttpException('File not found', 404);
        }
        console.log('File uploaded', file);
        return { message: "File uploaded successfully" };
    }
}
