import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera';

export interface CapturedPhoto {
  dataUrl: string;
  format: string;
}

/** Camera service — wraps @capacitor/camera for taking or picking a photo. */
export const CameraService = {
  requestPermissions() {
    return Camera.requestPermissions({ permissions: ['camera', 'photos'] });
  },
  checkPermissions() {
    return Camera.checkPermissions();
  },
  async take(source: CameraSource = CameraSource.Prompt): Promise<CapturedPhoto> {
    const photo: Photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source,
      saveToGallery: false,
      promptLabelHeader: 'Progress photo',
    });
    return { dataUrl: photo.dataUrl ?? '', format: photo.format };
  },
  fromCamera() {
    return this.take(CameraSource.Camera);
  },
  fromGallery() {
    return this.take(CameraSource.Photos);
  },
};
