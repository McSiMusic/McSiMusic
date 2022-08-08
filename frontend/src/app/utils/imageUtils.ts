export const createImageFromBlob = (image: Blob) => {
  let reader = new FileReader();

  return new Promise((resolve) => {
    reader.addEventListener('load', () => resolve(reader.result), false);

    if (image) {
      reader.readAsDataURL(image);
    }
  });
};
