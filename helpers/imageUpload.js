const { cloudinary } = require('../utils/cloudinary');

/** Upload image file to Cloudinary */
const imageUpload = async (fileStr) => {
  const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'capstone_connections',
  }); 
  console.log("UPLOADRESPONSE: ", uploadResponse);
  return uploadResponse;
}

module.exports = imageUpload;