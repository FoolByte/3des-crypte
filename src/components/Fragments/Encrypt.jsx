import { useState } from 'react';
import { encryptImage, getFileExtension } from '../../lib/cryptoUtils';
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
  const [encryptedResult, setEncryptedResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [resetUploader, setResetUploader] = useState(0);
  // const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const maxSizeMB = 5;
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
      console.log('Hasil encrypted:', encrypted);
      setEncryptedResult(encrypted);
      setShowDialog(true);
    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat enkripsi');
      console.error('Encrypt error:', error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDownload = () => {
    if (!encryptedResult) return;

    const url = URL.createObjectURL(encryptedResult.blob);
    const a = document.createElement('a');
    a.href = url;

    // Get file extension based on original MIME type
    const extension = getFileExtension(encryptedResult.mimeType);
    a.download = `${fileName}.${extension}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setKey('');
    setEncryptedResult(null);
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
      <CardBase
        title={`Pilih Gambar`}
        description={`(JPG/PNG, Max ${maxSizeMB} MB)`}
      >
        <ImageUploader
          onFileChange={(file) => {
            setSelectedFile(file);
            setFileName(file ? file.name.replace(/\[.*?\]/g, '').split('.')[0] + ' [encrypted]' : '');
          }}
          resetTrigger={resetUploader}
          maxSize={maxSize} // Atur ukuran maksimum file
        />
      </CardBase>

      {/* Dialog box download file encrypted */}
      <DialogDownload
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        handleDownload={handleDownload}
        fileName={fileName}
        resetForm={resetForm}
        encryptedResult={encryptedResult}
      />
    </div>
  );
};

export default Encrypt;
