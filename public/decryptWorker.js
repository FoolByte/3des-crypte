self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

/**
 * Mengekstrak data terenkripsi dari array byte gambar
 */
function extractEncryptedData(imageData) {
  try {
    const imageString = new TextDecoder().decode(imageData);
    const start = imageString.indexOf('<<ENCRYPTED_DATA_START>>');
    const end = imageString.indexOf('<<ENCRYPTED_DATA_END>>');
    if (start === -1 || end === -1) return null;
    return imageString.substring(start + 24, end); // 24 = panjang marker pembuka
  } catch (e) {
    return null;
  }
}

self.onmessage = (e) => {
  try {
    const { buffer, key } = e.data;
    const imageData = new Uint8Array(buffer);
    const encryptedData = extractEncryptedData(imageData);

    if (!encryptedData) {
      self.postMessage({ status: 'error', message: 'Gagal mengekstrak data terenkripsi' });
      return;
    }

    const decrypted = CryptoJS.TripleDES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      self.postMessage({ status: 'error', message: 'Key tidak cocok atau file tidak valid' });
      return;
    }

    self.postMessage({
      status: 'success',
      decryptedBase64: decryptedString,
    });
  } catch (err) {
    self.postMessage({ status: 'error', message: err.message });
  }
};
