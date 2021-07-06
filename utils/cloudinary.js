// require('dotenv').config();
const config = require('../config');

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,CLOUDINARY_NAME } = require("../config");

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
