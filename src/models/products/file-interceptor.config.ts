import { diskStorage } from 'multer';

import {
  editFileName,
  imageFileFilter,
} from 'src/common/helpers/file-upload.helper';

export const config = {
  fieldName: 'image',
  localOptions: {
    storage: diskStorage({
      destination: './uploads/products',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  },
};
