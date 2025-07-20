import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Loader2, AlertCircle } from 'lucide-react';
import CardBase from '../Fragments/CardBase';

const CryptionKey = ({ type = 'encrypt', keyValue, setKey, processCryption, selectedFile, isProcessing, error, customText, setCustomText, isValid }) => {
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const isEncryption = type === 'encrypt';

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      processCryption();
    }
  };

  const toggleNote = () => {
    setIsNoteVisible(true);
    // Focus on custom text input after state update
    setTimeout(() => {
      const customInput = document.getElementById('customText');
      customInput?.focus();
    }, 0);
  };

  const getTitle = 'Password';
  const getDescription = () => (isEncryption ? 'Password akan digunakan sebagai key' : 'Password sebagai key untuk dekripsi');

  const getPlaceholder = () => (isEncryption ? 'Minimal 6 karakter' : 'Key yang sama saat enkripsi');

  const getButtonText = () => (isEncryption ? 'Enkripsi' : 'Dekripsi');
  const getIcon = () => (isEncryption ? Lock : Unlock);

  const IconComponent = getIcon();

  return (
    <CardBase
      title={getTitle}
      description={getDescription()}
    >
      <div className={`${isEncryption ? 'min-h-26.5' : 'min-h-15'} mb-1`}>
        <Input
          type="text"
          value={keyValue}
          onChange={(e) => setKey(e.target.value)}
          placeholder={getPlaceholder()}
          className="text-xs mb-3"
          onKeyPress={handleKeyPress}
          aria-label={`Key ${isEncryption ? 'Enkripsi' : 'Dekripsi'}`}
        />

        {/* Custom text input - only for encryption */}
        {isEncryption && (
          <>
            {isNoteVisible ? (
              <Input
                id="customText"
                type="text"
                placeholder="Contoh: CONFIDENTIAL, PRIVATE, atau tulisan lainnya..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={50}
                className="text-xs"
                onKeyPress={handleKeyPress}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleNote}
                className="w-full text-xs"
                type="button"
              >
                Tambah Catatan (Opsional)
              </Button>
            )}
          </>
        )}

        {/* Error message */}
        {error && (
          <div className="text-red-500 dark:text-red-400 text-[11px] flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <Button
        onClick={processCryption}
        disabled={!selectedFile || !isValid || isProcessing}
        className="text-xs w-full"
      >
        {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
        {getButtonText()}
      </Button>
    </CardBase>
  );
};

export default CryptionKey;
