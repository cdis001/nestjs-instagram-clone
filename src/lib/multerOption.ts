import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const multerOptions = {
    storage: diskStorage({
      destination: (req, file, callback) => {
        callback(null, "uploads/")
      },
      filename: (req, file, cb) => {
        cb(null, `${uuid()}${file.originalname}`)
      }
    }),

}

export const createImageURL = (file): string => {
  const serverAddress: string = process.env.SERVER_ADDRESS;

  return `${serverAddress}/uploads/${file.originalname}`;
};
