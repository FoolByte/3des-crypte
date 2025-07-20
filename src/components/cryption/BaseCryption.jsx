import { useEffect } from 'react';
import { TypographyH3 } from '../Typography/TypographyH3';
import TypoP from '../Typography/TypoP';
import ImageUploader from '@/components/Fragments/ImageUploader';
import CardBase from '../Fragments/CardBase';
import CryptionKey from './CryptionKey';
import CryptionDialog from './CryptionDialog';
import { useCryption } from '../../hooks/useCryption';

const BaseCryption = ({ type = 'encrypt' }) => {
  const { selectedFile, key, customText, isProcessing, result, error, showDialog, resetUploader, setKey, setCustomText, setShowDialog, handleFileChange, processCryption, handleDownload, resetForm, isValid } = useCryption(type);

  const isEncryption = type === 'encrypt';

  // Auto-focus on key input when file is selected
  useEffect(() => {
    if (selectedFile) {
      const input = document.querySelector('input[type="text"]');
      input?.focus();
    }
  }, [selectedFile]);

  const getTitle = () => (isEncryption ? 'Enkripsi Gambar' : 'Dekripsi Gambar');
  const getDescription = () => (isEncryption ? 'Amankan gambar Anda dengan Triple DES' : 'Pulihkan gambar terenkripsi dengan Triple DES');

  const getCardTitle = () => (isEncryption ? 'Pilih Gambar' : 'Pilih Gambar Terenkripsi');

  return (
    <div className="space-y-6 md:px-20">
      {/* Header */}
      <div className="text-center">
        <TypographyH3>{getTitle()}</TypographyH3>
        <TypoP>{getDescription()}</TypoP>
      </div>

      {/* Image Upload */}
      <CardBase
        title={getCardTitle()}
        description="(JPG/PNG)"
      >
        <ImageUploader
          onFileChange={handleFileChange}
          resetTrigger={resetUploader}
        />
      </CardBase>

      {/* Key Input */}
      {selectedFile && (
        <CryptionKey
          type={type}
          keyValue={key}
          setKey={setKey}
          processCryption={processCryption}
          selectedFile={selectedFile}
          isProcessing={isProcessing}
          error={error}
          customText={customText}
          setCustomText={setCustomText}
          isValid={isValid}
        />
      )}

      {/* Result Dialog */}
      <CryptionDialog
        type={type}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        result={result}
        handleDownload={handleDownload}
        resetForm={resetForm}
      />
    </div>
  );
};

export default BaseCryption;
