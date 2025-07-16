import { useState } from 'react';
import { decryptFile } from '../../lib/cryptoUtils';
import CardBase from './CardBase';
import { TypographyH3 } from '../Typography/TypographyH3';
import TypoP from '../Typography/TypoP';
import FileUploader from '../comp-548';
import DecryptKey from './DecryptKey';
import DialogDecrypt from './DialogDecrypt';

export default function Decrypt() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedResult, setDecryptedResult] = useState(null);
  const [error, setError] = useState('');
  const [resetUploader, setResetUploader] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (file) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith('.enc')) {
      setError('Hanya file .enc yang diizinkan');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDecrypt = async () => {
    if (!selectedFile || !key.trim()) {
      setError('Pilih file .enc dan masukkan key terlebih dahulu');
      return;
    }

    setIsDecrypting(true);
    setError('');
    setDecryptedResult(null);

    try {
      const result = await decryptFile(selectedFile, key);
      setDecryptedResult(result);
      setIsDialogOpen(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadImage = (result = decryptedResult) => {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    let downloadName = 'decrypted [decrypt].png';

    if (selectedFile) {
      downloadName =
        selectedFile.name
          .replace(/\[.*?\]/g, '')
          .replace('.enc', '')
          .trim() + ' [decrypt].png';
    }
    setIsDialogOpen(false);

    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setKey('');
    setDecryptedResult(null);
    setError('');
    setResetUploader((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 md:px-20">
      <div className="text-center">
        <TypographyH3>Dekripsi Gambar</TypographyH3>
        <TypoP>Kembalikan gambar terenkripsi ke bentuk aslinya</TypoP>
      </div>

      {/* Key Input */}
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

      {/* File Upload */}
      <CardBase title="Pilih File Hasil Enkripsi (.enc)">
        <FileUploader
          onFileChange={handleFileChange}
          resetTrigger={resetUploader}
          accept=".enc"
        />
      </CardBase>

      <DialogDecrypt
        showDialog={isDialogOpen}
        setShowDialog={setIsDialogOpen}
        decryptedResult={decryptedResult ? decryptedResult.imageDataUrl : null}
        handleDownloadImage={handleDownloadImage}
        resetForm={resetForm}
      />
    </div>
  );
}
