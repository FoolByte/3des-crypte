import CryptoJS from 'crypto-js';

// Encrypt image file and create scrambled pixel image
export const encryptImage = async (file, key) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const base64Data = e.target.result.split(',')[1]; // Remove data:image/...;base64, prefix

        // Encrypt using Triple DES with CBC mode
        const encrypted = CryptoJS.TripleDES.encrypt(base64Data, key, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });

        // Convert encrypted data to scrambled image
        const encryptedString = encrypted.toString();
        const scrambledImageBlob = createScrambledImage(encryptedString);

        resolve(scrambledImageBlob);
      } catch (error) {
        reject(new Error('Enkripsi gagal: ' + error.message));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
};

// Decrypt scrambled image back to original image
export const decryptImage = async (file, key) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        // Extract encrypted data from scrambled image
        const imageData = new Uint8Array(e.target.result);
        const encryptedData = extractDataFromImage(imageData);

        if (!encryptedData) {
          throw new Error('File gambar tidak valid atau bukan hasil enkripsi');
        }

        // Decrypt using Triple DES
        const decrypted = CryptoJS.TripleDES.decrypt(encryptedData, key, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
          throw new Error('Key tidak cocok atau file tidak valid');
        }

        // Convert back to image data URL
        const imageDataUrl = `data:image/png;base64,${decryptedString}`;

        // Create blob for download
        const byteCharacters = atob(decryptedString);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        resolve({
          imageDataUrl,
          blob,
        });
      } catch (error) {
        console.error('Decrypt error:', error);
        reject(new Error('Key tidak cocok atau file tidak valid'));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsArrayBuffer(file);
  });
};

// Create scrambled image from encrypted data
const createScrambledImage = (encryptedData) => {
  // Create canvas for image generation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Calculate image dimensions (square image)
  const dataLength = encryptedData.length;
  const dimension = Math.ceil(Math.sqrt(dataLength / 3)); // 3 bytes per pixel (RGB)
  canvas.width = dimension;
  canvas.height = dimension;

  // Create image data
  const imageData = ctx.createImageData(dimension, dimension);
  const data = imageData.data;

  // Fill pixels with encrypted data
  let dataIndex = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (dataIndex < encryptedData.length) {
      // Use encrypted data bytes as RGB values
      data[i] = encryptedData.charCodeAt(dataIndex % encryptedData.length); // R
      data[i + 1] = encryptedData.charCodeAt((dataIndex + 1) % encryptedData.length); // G
      data[i + 2] = encryptedData.charCodeAt((dataIndex + 2) % encryptedData.length); // B
      dataIndex += 3;
    } else {
      // Fill remaining pixels with pseudo-random values based on key
      data[i] = (i * 137) % 256; // R
      data[i + 1] = (i * 211) % 256; // G
      data[i + 2] = (i * 317) % 256; // B
    }
    data[i + 3] = 255; // Alpha (full opacity)
  }

  // Put image data on canvas
  ctx.putImageData(imageData, 0, 0);

  // Store encrypted data in canvas metadata (custom property)
  canvas._encryptedData = encryptedData;

  // Convert canvas to blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      // Add encrypted data to blob metadata
      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        // Append encrypted data as metadata at the end
        const metadataMarker = new TextEncoder().encode('<<ENCRYPTED_DATA_START>>');
        const encryptedBytes = new TextEncoder().encode(encryptedData);
        const metadataEnd = new TextEncoder().encode('<<ENCRYPTED_DATA_END>>');

        const newSize = uint8Array.length + metadataMarker.length + encryptedBytes.length + metadataEnd.length;
        const newArray = new Uint8Array(newSize);

        // Copy original image data
        newArray.set(uint8Array, 0);
        // Append metadata
        newArray.set(metadataMarker, uint8Array.length);
        newArray.set(encryptedBytes, uint8Array.length + metadataMarker.length);
        newArray.set(metadataEnd, uint8Array.length + metadataMarker.length + encryptedBytes.length);

        const modifiedBlob = new Blob([newArray], { type: 'image/png' });
        resolve(modifiedBlob);
      };
      reader.readAsArrayBuffer(blob);
    }, 'image/png');
  });
};

// Extract encrypted data from scrambled image
const extractDataFromImage = (imageData) => {
  try {
    // Convert to string to search for markers
    const imageString = new TextDecoder().decode(imageData);

    // Find encrypted data between markers
    const startMarker = '<<ENCRYPTED_DATA_START>>';
    const endMarker = '<<ENCRYPTED_DATA_END>>';
    const startIndex = imageString.indexOf(startMarker);
    const endIndex = imageString.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      return null;
    }

    const encryptedData = imageString.substring(startIndex + startMarker.length, endIndex);
    return encryptedData;
  } catch (error) {
    console.error('Error extracting data from image:', error);
    return null;
  }
};

// Validate file size (max 5MB)
export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Validate image file type
export const validateImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return validTypes.includes(file.type);
};
