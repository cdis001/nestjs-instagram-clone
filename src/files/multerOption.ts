import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      callback(null, process.env.SERVER_ADDRESS + 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid()}${file.originalname}`);
    },
  }),
};
