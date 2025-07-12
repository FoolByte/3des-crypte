import CryptoJS from 'crypto-js';

// Encrypt image file using Triple DES
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

        // Convert to blob
        const encryptedString = encrypted.toString();
        const blob = new Blob([encryptedString], { type: 'application/octet-stream' });

        resolve(blob);
      } catch (error) {
        reject(new Error('Enkripsi gagal: ' + error.message));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
};

// Decrypt .enc file back to image
export const decryptFile = async (file, key) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const encryptedData = e.target.result;

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
        console.error(error);
        reject(new Error('Password tidak cocok'));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
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
