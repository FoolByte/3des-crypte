import { useState, useCallback } from 'react';
import { encryptImage, decryptImage, getFileExtension } from '../lib/cryptoUtils';

export const useCryption = (type = 'encrypt') => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState('');
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [resetUploader, setResetUploader] = useState(0);

  const isEncryption = type === 'encrypt';
  const minKeyLength = isEncryption ? 6 : 1;

  const validateKey = useCallback(
    (keyValue) => {
      return keyValue.trim().length >= minKeyLength;
    },
    [minKeyLength],
  );

  const setKeyWithValidation = useCallback(
    (value) => {
      setKey(value);
      if (isEncryption && value.length < 6 && value.length > 0) {
        setError(`Key minimal 6 karakter. ${6 - value.length} karakter lagi.`);
      } else if (error) {
        setError('');
      }
    },
    [error, isEncryption],
  );

  const handleFileChange = useCallback(
    (file) => {
      setSelectedFile(file);
      if (file) {
        const baseName = file.name.replace(/\[.*?\]/g, '').split('.')[0];
        const suffix = isEncryption ? ' [encrypted]' : '';
        setFileName(baseName + suffix);
      } else {
        setFileName('');
      }
    },
    [isEncryption],
  );

  const processCryption = useCallback(async () => {
    if (!validateKey(key)) {
      if (isEncryption) {
        setError(`Key minimal ${minKeyLength} karakter. Anda perlu mengetikkan ${minKeyLength - key.length} karakter lagi.`);
      }
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log(`Mulai ${type}:`, selectedFile, key, ...(isEncryption ? [customText] : []));

      const processedResult = isEncryption ? await encryptImage(selectedFile, key, customText) : await decryptImage(selectedFile, key);

      console.log(`Hasil ${type}:`, processedResult);
      setResult(processedResult);
      setShowDialog(true);
    } catch (error) {
      setError(error.message || `Terjadi kesalahan saat ${type === 'encrypt' ? 'enkripsi' : 'dekripsi'}`);
      console.error(`${type} error:`, error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, key, customText, validateKey, minKeyLength, type, isEncryption]);

  const handleDownload = useCallback(() => {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;

    let extension;
    if (isEncryption && result.mimeType) {
      extension = getFileExtension(result.mimeType);
    } else {
      extension = 'png'; // Default for decrypted images
    }

    const downloadName = isEncryption ? `${fileName}.${extension}` : `${fileName} [decrypted].${extension}`;

    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, fileName, isEncryption]);

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setKey('');
    setCustomText('');
    setResult(null);
    setFileName('');
    setError('');
    setResetUploader((prev) => prev + 1);
  }, []);

  return {
    // State
    selectedFile,
    key,
    customText,
    isProcessing,
    result,
    fileName,
    error,
    showDialog,
    resetUploader,

    // Actions
    setKey: setKeyWithValidation,
    setCustomText,
    setShowDialog,
    handleFileChange,
    processCryption,
    handleDownload,
    resetForm,
    setError,

    // Computed
    isValid: selectedFile && validateKey(key),
    isEncryption,
  };
};
