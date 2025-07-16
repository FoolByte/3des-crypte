import { useState } from 'react';
import { encryptImage } from '../../lib/cryptoUtils';
import { TypographyH3 } from '../Typography/TypographyH3';
import TypoP from '../Typography/TypoP';
import ImageUploader from '../comp-545';
import CardBase from './CardBase';

import DialogDownload from './DialogDownload';
import EncryptKey from './EncryptKey';
import DialogEncryptKey from './DialogEncrytpKey';

const Encrypt = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedBlob, setEncryptedBlob] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [resetUploader, setResetUploader] = useState(0);
  // const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const maxSizeMB = 2;
  const maxSize = maxSizeMB * 1024 * 1024; // 2MB default

  const handleEncrypt = async () => {
    if (key.length < 6) {
      setError(`Key minimal 6 karakter. Anda perlu mengetikkan ${6 - key.length} karakter lagi.`);
      return;
    }

    setIsEncrypting(true);
    // setShowPasswordDialog((prev) => !prev);
    setError('');

    try {
      // await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('Mulai enkripsi:', selectedFile, key);
      const encrypted = await encryptImage(selectedFile, key);
      console.log('Hasil blob:', encrypted);
      setEncryptedBlob(encrypted);
      setShowDialog(true);
    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat enkripsi');
      console.error('Encrypt error:', error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDownload = () => {
    if (!encryptedBlob) return;

    const url = URL.createObjectURL(encryptedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.enc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setKey('');
    setEncryptedBlob(null);
    setFileName('');
    setError('');
    setResetUploader((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 md:px-20">
      <div className="text-center">
        <TypographyH3>Enkripsi Gambar</TypographyH3>
        <TypoP>Amankan gambar Anda dengan enkripsi Triple DES</TypoP>
      </div>

      {/* Input Password Enkripsi */}
      {selectedFile && (
        <EncryptKey
          keyValue={key}
          setKey={setKey}
          handleEncrypt={handleEncrypt}
          selectedFile={selectedFile}
          isEncrypting={isEncrypting}
          error={error}
          setError={setError}
        />
      )}

      {/* Image Upload */}
      <CardBase title={`Pilih Gambar (JPG/PNG, max. ${maxSizeMB}MB)`}>
        <ImageUploader
          onFileChange={(file) => {
            setSelectedFile(file);
            setFileName(file ? file.name.replace(/\[.*?\]/g, '').split('.')[0] + ' [encrypted]' : '');
          }}
          resetTrigger={resetUploader}
          maxSize={maxSize} // Atur ukuran maksimum file
        />
      </CardBase>

      {/* Dialog box download file .enc */}
      <DialogDownload
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        handleDownload={handleDownload}
        fileName={fileName}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Encrypt;
