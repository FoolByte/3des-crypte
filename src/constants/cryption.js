export const CRYPTION_TYPES = {
  ENCRYPT: 'encrypt',
  DECRYPT: 'decrypt',
};

export const VALIDATION_RULES = {
  MIN_KEY_LENGTH: 6,
  MAX_CUSTOM_TEXT_LENGTH: 50,
};

export const ERROR_MESSAGES = {
  MIN_KEY_LENGTH: (missing) => `Key minimal 6 karakter. ${missing} karakter lagi.`,
  ENCRYPTION_ERROR: 'Terjadi kesalahan saat enkripsi',
  DECRYPTION_ERROR: 'Terjadi kesalahan saat dekripsi',
  INVALID_KEY: 'Key tidak valid',
};

export const SUCCESS_MESSAGES = {
  DOWNLOAD_SUCCESS: 'Gambar diunduh!',
  ENCRYPT_SUCCESS: 'Enkripsi berhasil!',
  DECRYPT_SUCCESS: 'Dekripsi berhasil!',
};
