import { extname } from 'path';

export const imageFileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (_req, file, callback) => {
  const name = String(file.originalname.split('.')[0]).split(' ').join('');
  const fileExtName = extname(file.originalname).split(' ').join('');
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  callback(null, `${name}-${randomName}${fileExtName}`);
};
