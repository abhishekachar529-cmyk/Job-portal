// backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/',
    'uploads/resumes/',
    'uploads/profiles/',
    'uploads/logos/',
    'uploads/others/'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

// ✅ Create directories on module load
createUploadDirs();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = 'uploads/';
    if (file.fieldname === 'resume') {
      folder += 'resumes/';
    } else if (file.fieldname === 'profilePhoto') {
      folder += 'profiles/';
    } else if (file.fieldname === 'companyLogo') {
      folder += 'logos/';
    } else {
      folder += 'others/';
    }
    cb(null, path.join(__dirname, '../../', folder));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDF documents are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;