const multer = require('multer');
const { randomBytes } = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },

  filename: (req, file, cb) => {
    cb(null, `${randomBytes(14).toString('hex')}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(
    (acceptedFormat) => acceptedFormat == file.mimetype
  );

  if (isAccepted) return cb(null, true);

  return cb(null, false);
};

module.exports = multer({ storage, fileFilter });
