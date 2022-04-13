import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

export const config = {
  fieldName: 'image',
  localOptions: {
    storage: diskStorage({
      destination: './uploads/suppliers',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  },
};
