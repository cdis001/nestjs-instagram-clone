import { Injectable, UploadedFiles } from '@nestjs/common';

@Injectable()
export class FilesService {
    uploadFiles(@UploadedFiles() files: Express.Multer.File[]): string[] {
      const generatedFiles: string[] = []
  
      for (const file of files) {
        generatedFiles.push(this.createImageURL(file));
      }
      return generatedFiles;
    }

    createImageURL(file: Express.Multer.File): string {
        const serverAddress: string = process.env.SERVER_ADDRESS;
      
        return `${serverAddress}/uploads/${file.originalname}`;
      };
}
