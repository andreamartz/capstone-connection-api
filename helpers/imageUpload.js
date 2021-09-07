const { cloudinary } = require('../utils/cloudinary');

// Transformations for rounded avatar images:
// { width: 50, height: 50, crop: 'thumb', radius: 'max', gravity: 'face' }
// make the extension png to get transparent background

/** Upload image file to Cloudinary */
const imageUpload = async (fileStr) => {
	try {
		const uploadResponse = await cloudinary.uploader
			.upload(fileStr, {
				upload_preset: 'capstone_connections',
			})
			.catch((err) => {
				console.error('UPLOAD ERROR:', err);
			});
		return uploadResponse;
	} catch (error) {
		console.error('ERROR in imageUpload: ', error);
	}
};

module.exports = imageUpload;
