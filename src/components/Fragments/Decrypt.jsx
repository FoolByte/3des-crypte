import { useState } from 'react';
import { decryptImage } from '../../lib/cryptoUtils';
import { TypographyH3 } from '../Typography/TypographyH3';
import TypoP from '../Typography/TypoP';
import ImageUploader from '../comp-545';
import CardBase from './CardBase';
import DialogDecrypt from './DialogDecrypt';
import DecryptKey from './DecryptKey';

const Decrypt = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedResult, setDecryptedResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [resetUploader, setResetUploader] = useState(0);

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

  const handleDecrypt = async () => {
    if (!selectedFile) {
      setError('Pilih file gambar terlebih dahulu');
      return;
    }

    if (key.length < 6) {
      setError(`Key minimal 6 karakter. Anda perlu mengetikkan ${6 - key.length} karakter lagi.`);
      return;
    }

    setIsDecrypting(true);
    setError('');

    try {
      console.log('Mulai dekripsi:', selectedFile, key);
      const decrypted = await decryptImage(selectedFile, key);
      console.log('Hasil dekripsi:', decrypted);
      setDecryptedResult(decrypted);
      setShowDialog(true);
    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat dekripsi');
      console.error('Decrypt error:', error);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadImage = () => {
    if (!decryptedResult) return;

    const url = URL.createObjectURL(decryptedResult.blob);
    const a = document.createElement('a');
    a.href = url;

    // Determine file extension - default to png since decrypted images are usually png
    const extension = 'png';
    a.download = `${fileName}_decrypted.${extension}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setKey('');
    setDecryptedResult(null);
    setFileName('');
    setError('');
    setResetUploader((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 md:px-20">
      <div className="text-center">
        <TypographyH3>Dekripsi Gambar</TypographyH3>
        <TypoP>Pulihkan gambar terenkripsi dengan Triple DES</TypoP>
      </div>

      {/* Input Password Dekripsi */}
      {selectedFile && (
        <DecryptKey
          keyValue={key}
          setKey={setKey}
          handleDecrypt={handleDecrypt}
          selectedFile={selectedFile}
          isDecrypting={isDecrypting}
          error={error}
        />
      )}

      {/* Image Upload */}
      <CardBase
        title={`Pilih Gambar Terenkripsi`}
        description={`(JPG/PNG, Max ${maxSizeMB} MB)`}
      >
        <ImageUploader
          onFileChange={(file) => {
            setSelectedFile(file);
            setFileName(file ? file.name.replace(/\[.*?\]/g, '').split('.')[0] : '');
            setError(''); // Clear error when new file is selected
          }}
          resetTrigger={resetUploader}
          maxSize={maxSize}
        />
      </CardBase>

      {/* Dialog box download decrypted image */}
      <DialogDecrypt
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        decryptedResult={decryptedResult}
        handleDownloadImage={handleDownloadImage}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Decrypt;
