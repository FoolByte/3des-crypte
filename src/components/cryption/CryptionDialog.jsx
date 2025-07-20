import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import BtnClear from '../Elements/Button/BtnClear';
import BtnDownload from '../Elements/Button/BtnDownload';
import BtnShow from '../Elements/Button/BtnShow';

const CryptionDialog = ({ type = 'encrypt', showDialog, setShowDialog, result, handleDownload, resetForm }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const isEncryption = type === 'encrypt';

  const getTitle = () => (isEncryption ? 'Enkripsi Berhasil!' : 'Dekripsi Berhasil!');

  const getDescription = () => (isEncryption ? 'Gambar Anda telah berhasil dienkripsi.' : 'Gambar Anda telah berhasil didekripsi dan dipulihkan ke bentuk aslinya.');

  const getDownloadText = () => (isEncryption ? 'Download Gambar Terenkripsi' : 'Download Gambar Asli');

  const getToastMessage = () => 'Gambar diunduh!';

  const handleDownloadClick = () => {
    handleDownload();
    resetForm();
    toast.success(getToastMessage());
  };

  const renderEncryptionPreview = () => {
    if (!isEncryption || !result) return null;

    return (
      <div className="space-y-4">
        {/* Toggle Button */}
        <div className="flex justify-center">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-2"
          >
            {showOriginal ? (
              <>
                <EyeOff className="h-4 w-4" />
                Lihat Hasil Enkripsi
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Lihat Gambar Asli
              </>
            )}
          </Button> */}
          <BtnShow
            showOriginal={showOriginal}
            onClick={() => setShowOriginal(!showOriginal)}
          />
        </div>

        {/* Image Preview */}
        <div className="flex flex-col items-center space-y-2">
          <DialogDescription>{showOriginal ? 'Gambar Asli:' : 'Hasil Enkripsi:'}</DialogDescription>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={showOriginal ? result.originalDataUrl : result.scrambledDataUrl}
              alt={showOriginal ? 'Original Image' : 'Scrambled Image'}
              className="max-w-full max-h-64 object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderDecryptionPreview = () => {
    if (isEncryption || !result) return null;

    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={result.imageDataUrl}
              alt="Decrypted Image"
              className="max-w-full max-h-64 object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={showDialog}
      onOpenChange={setShowDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {/* Preview Images */}
        {renderEncryptionPreview()}
        {renderDecryptionPreview()}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <DialogClose asChild>
            <BtnDownload
              onClick={handleDownloadClick}
              getDownloadText={getDownloadText}
            />
          </DialogClose>

          <DialogClose asChild>
            <BtnClear onClick={resetForm} />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptionDialog;
