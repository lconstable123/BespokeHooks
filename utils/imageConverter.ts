export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageConverter = async (image) => {
  if (!image.file) return;

  try {
    let convertedBlob = await heic2any({
      blob: image.file,
      toType: "image/jpeg",
    });

    if (Array.isArray(convertedBlob)) {
      convertedBlob = convertedBlob[0];
    }
    const convertedFile = new File(
      [convertedBlob],
      image.file.name.replace(/\.heic$/i, ".jpg"),
      { type: "image/jpeg" }
    );

    return convertedFile;
  } catch (err) {
    console.error("Image conversion failed:", err);
    return null;
  }
};
