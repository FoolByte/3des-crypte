import CryptoJS from 'crypto-js';

// Encrypt image file and create scrambled pixel image
export const encryptImage = async (file, key, customText = '') => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async function (e) {
      const base64Data = e.target.result.split(',')[1];

      const worker = new Worker('/encryptWorker.js');

      worker.postMessage({
        base64Data,
        mimeType: file.type,
        key,
        customText,
      });

      worker.onmessage = async (event) => {
        const { status, encryptedData, message } = event.data;

        if (status === 'error') {
          reject(new Error(message));
        } else {
          try {
            const result = await createScrambledImage(encryptedData, file.type, customText);
            resolve({
              blob: result.blob,
              scrambledDataUrl: result.dataUrl,
              originalDataUrl: e.target.result,
              mimeType: file.type,
              customText,
            });
          } catch (err) {
            reject(new Error('Gagal membuat gambar terenkripsi: ' + err.message));
          }
        }
      };

      worker.onerror = () => reject(new Error('Gagal menjalankan worker'));
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Mendekripsi file gambar terenkripsi (yang telah diacak) menggunakan Web Worker.
 *
 * Proses mencakup:
 *  - Membaca file sebagai ArrayBuffer
 *  - Mengirim ke Web Worker untuk mengekstrak data terenkripsi
 *  - Mendekripsi dengan Triple DES
 *  - Mengembalikan blob dan data URL dari hasil dekripsi
 *
 * @param {File} file - File hasil enkripsi (scrambled image)
 * @param {string} key - Kata sandi untuk mendekripsi
 * @returns {Promise<{ imageDataUrl: string, blob: Blob }>}
 */
export const decryptImage = async (file, key) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      const buffer = e.target.result;

      const worker = new Worker('/decryptWorker.js');

      worker.postMessage({ buffer, key });

      worker.onmessage = (event) => {
        const { status, decryptedBase64, message } = event.data;

        if (status === 'error') {
          console.error('Decrypt error:', message);
          reject(new Error('Password tidak valid'));
        } else {
          try {
            const byteCharacters = atob(decryptedBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });
            const imageDataUrl = `data:image/png;base64,${decryptedBase64}`;

            resolve({
              imageDataUrl,
              blob,
            });
          } catch (error) {
            console.error('Error during decryption:', error);
            reject(new Error('Gagal membentuk gambar hasil dekripsi'));
          }
        }
      };

      worker.onerror = () => reject(new Error('Worker dekripsi gagal'));
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsArrayBuffer(file);
  });
};

// Create scrambled image from encrypted data
const createScrambledImage = (encryptedData, originalMimeType = 'image/jpeg', customText = '') => {
  return new Promise((resolve) => {
    // Create canvas for image generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate image dimensions (minimum 400x400 for better text visibility)
    const dataLength = encryptedData.length;
    const minDimension = 400;
    const calculatedDimension = Math.ceil(Math.sqrt(dataLength / 3)); // 3 bytes per pixel (RGB)
    const dimension = Math.max(minDimension, calculatedDimension);

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
        // Fill remaining pixels with pseudo-random values
        data[i] = (i * 137) % 256; // R
        data[i + 1] = (i * 211) % 256; // G
        data[i + 2] = (i * 317) % 256; // B
      }
      data[i + 3] = 255; // Alpha (full opacity)
    }

    // Put image data on canvas
    ctx.putImageData(imageData, 0, 0);

    // Add custom text overlay if provided
    if (customText.trim()) {
      // Create semi-transparent overlay for better text visibility
      const overlayCanvas = document.createElement('canvas');
      const overlayCtx = overlayCanvas.getContext('2d');
      overlayCanvas.width = dimension;
      overlayCanvas.height = dimension;

      // Draw semi-transparent background
      overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      overlayCtx.fillRect(0, 0, dimension, dimension);

      // Setup text styling
      const fontSize = Math.max(24, dimension / 15);
      overlayCtx.font = `bold ${fontSize}px Arial, sans-serif`;
      overlayCtx.fillStyle = '#ffffff';
      overlayCtx.strokeStyle = '#000000';
      overlayCtx.lineWidth = 2;
      overlayCtx.textAlign = 'center';
      overlayCtx.textBaseline = 'middle';

      // Draw text with stroke for better visibility
      const centerX = dimension / 2;
      const centerY = dimension / 2;

      overlayCtx.strokeText(customText, centerX, centerY);
      overlayCtx.fillText(customText, centerX, centerY);

      // Blend overlay with scrambled image
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(overlayCanvas, 0, 0);
    }

    // Get scrambled image data URL for preview
    const scrambledDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Convert canvas to blob with proper format
    const outputFormat = originalMimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    const quality = outputFormat === 'image/jpeg' ? 0.9 : undefined;

    canvas.toBlob(
      (blob) => {
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

          const modifiedBlob = new Blob([newArray], { type: outputFormat });
          resolve({
            blob: modifiedBlob,
            dataUrl: scrambledDataUrl,
          });
        };
        reader.readAsArrayBuffer(blob);
      },
      outputFormat,
      quality,
    );
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

// Get file extension from MIME type
export const getFileExtension = (mimeType) => {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
  };
  return extensions[mimeType] || 'jpg';
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
