const { cloudinary } = require('../utils/cloudinary');

// Transformations for rounded avatar images:
// { width: 50, height: 50, crop: 'thumb', radius: 'max', gravity: 'face' }
// make the extension png to get transparent background

/** Upload image file to Cloudinary */
const imageUpload = async (fileStr) => {
  try {
    // console.log("IN IMAGEUPLOAD", fileStr.substr(0, 40));
    const uploadResponse = await cloudinary.uploader
    .upload(fileStr, {
      upload_preset: 'capstone_connections',
    })
    .catch(err => {
      console.log("UPLOAD ERROR:", err)
    });
    // console.log("UPLOADRESPONSE: ", uploadResponse);
    return uploadResponse;
  } catch(error) {
    console.log("TRY/CATCH ERROR: ", error);
  }
}

module.exports = imageUpload;