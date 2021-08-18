import { Injectable, UploadedFiles, UploadedFile } from '@nestjs/common';
import { unlink } from 'fs';

@Injectable()
export class FilesService {
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]): string[] {
    const generatedFiles: string[] = [];

    for (const file of files) {
      generatedFiles.push(this.createImageURL(file));
    }
    return generatedFiles;
  }

  uploadFile(@UploadedFile() file: Express.Multer.File): string[] {
    const generatedFiles: string[] = [];

    generatedFiles.push(this.createImageURL(file[0]));
    return generatedFiles;
  }

  createImageURL(file: Express.Multer.File): string {
    const serverAddress: string = process.env.SERVER_ADDRESS;

    return `${serverAddress}uploads/${file.filename}`;
  }

  removeFile(fileUrl: string) {
    unlink(fileUrl, (err) => {
      if (err) throw err;
      console.log(err);
    });
  }
}
