import { cloudinaryService } from '../config/cloudinary.js';

export const mediaService = {
  async upload(fileBuffer, folder = 'synscapes') {
    return cloudinaryService.uploadImage(fileBuffer, folder);
  },

  resolve(url) {
    return cloudinaryService.resolveAssetUrl(url);
  }
};
