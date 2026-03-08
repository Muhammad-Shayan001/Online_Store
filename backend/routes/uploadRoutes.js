const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'online-store' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            console.error(error);
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req);
    // Send back the secure url
    res.send(result.secure_url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Upload failed');
  }
});

module.exports = router;
