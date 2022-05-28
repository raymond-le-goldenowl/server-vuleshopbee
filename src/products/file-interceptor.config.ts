import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

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
