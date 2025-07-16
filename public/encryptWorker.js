// public/encryptWorker.js

self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

function getEncryptedImage(base64Data, key, customText = '') {
  const encrypted = CryptoJS.TripleDES.encrypt(base64Data, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // return string hasil enkripsi
}

self.onmessage = async (e) => {
  try {
    const { base64Data, mimeType, key, customText } = e.data;
    const encryptedData = getEncryptedImage(base64Data, key, customText);
    self.postMessage({ status: 'success', encryptedData });
  } catch (err) {
    self.postMessage({ status: 'error', message: err.message });
  }
};
