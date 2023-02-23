import { diskStorage } from 'multer';

import {
  editFileName,
  imageFileFilter,
} from 'src/common/helpers/file-upload.helper';

export const config = {
  fieldName: 'icon',
  localOptions: {
    storage: diskStorage({
      destination: './uploads/slides',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  },
};
