const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const uniqid = require('uniqid');
const processFile = require('../middleware/upload');
// Instantiate a storage client with credentials
const serviceKey = path.join(__dirname, '../google-cloud-key.json');
const storage = new Storage({ keyFilename: serviceKey });
const bucket = storage.bucket('nusanty-bucket');
const upload = async (req, res, next) => {
  try {
    await processFile(req, res);
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file!' });
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(`foto_baju_adat/${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on('error', (err) => {
      res.status(500).json({ message: err.message });
    });
    blobStream.on('finish', async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
      );
      try {
        // Make the file public
        await bucket.file(`foto_baju_adat/${req.file.originalname}`).makePublic();
      } catch {
        return res.status(500).json({
          message:
            `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }
      res.status(200).json({
        message: `Uploaded the file successfully: ${req.file.originalname}`,
        url: publicUrl,
      });
    });
    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).json({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
module.exports = { upload };
