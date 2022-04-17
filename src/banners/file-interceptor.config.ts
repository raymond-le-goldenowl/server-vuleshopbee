import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

export const config = {
  fieldName: 'icon',
  localOptions: {
    storage: diskStorage({
      destination: './uploads/banners',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  },
};
