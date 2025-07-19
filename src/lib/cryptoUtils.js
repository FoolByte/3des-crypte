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

    // Set fixed dimensions for consistent appearance
    const dimension = 800;
    canvas.width = dimension;
    canvas.height = dimension;

    // Fill with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, dimension, dimension);

    // Draw crossed eye icon in the center
    const centerX = dimension / 2;
    const centerY = dimension / 2 - 60; // Move up a bit to make room for text
    const eyeRadius = 60;

    // Draw outer eye shape
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, eyeRadius * 1.5, eyeRadius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw inner circle (pupil)
    ctx.beginPath();
    ctx.arc(centerX, centerY, eyeRadius * 0.6, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw inner pupil
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, eyeRadius * 0.3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw cross over the eye
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 6;

    // Diagonal line from top-left to bottom-right
    ctx.beginPath();
    ctx.moveTo(centerX - eyeRadius * 1.2, centerY - eyeRadius * 0.8);
    ctx.lineTo(centerX + eyeRadius * 1.2, centerY + eyeRadius * 0.8);
    ctx.stroke();

    // Diagonal line from top-right to bottom-left
    ctx.beginPath();
    ctx.moveTo(centerX + eyeRadius * 1.2, centerY - eyeRadius * 0.8);
    ctx.lineTo(centerX - eyeRadius * 1.2, centerY + eyeRadius * 0.8);
    ctx.stroke();

    // Add main title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mainText = 'Gambar dienkripsi menggunakan';
    const methodText = 'metode Triple DES';

    // Draw main text in two lines
    ctx.fillText(mainText, centerX, centerY + 120);
    ctx.fillText(methodText, centerX, centerY + 155);

    // Add custom message if provided
    if (customText.trim()) {
      // Add separator line
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 200, centerY + 190);
      ctx.lineTo(centerX + 200, centerY + 190);
      ctx.stroke();

      // Setup custom text styling
      ctx.fillStyle = '#cccccc';
      ctx.font = 'italic 20px Arial, sans-serif';

      // Word wrap for long custom text
      const maxWidth = 600;
      const lineHeight = 30;
      const words = customText.split(' ');
      let line = '';
      let y = centerY + 230;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line.trim(), centerX, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }

      // Draw the last line
      if (line.trim()) {
        ctx.fillText(line.trim(), centerX, y);
      }
    }

    // Add subtle pattern overlay for texture
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * dimension;
      const y = Math.random() * dimension;
      const size = Math.random() * 3 + 1;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

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
