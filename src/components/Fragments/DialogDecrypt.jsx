import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BtnClear from '../Elements/Button/BtnClear';

export default function DialogDecrypt({ showDialog, setShowDialog, decryptedResult, handleDownloadImage, resetForm }) {
  return (
    <Dialog
      open={showDialog}
      onOpenChange={setShowDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dekripsi Berhasil!</DialogTitle>
          <DialogDescription>Gambar Anda telah berhasil didekripsi dan dipulihkan ke bentuk aslinya.</DialogDescription>
        </DialogHeader>

        {/* Preview Decrypted Image */}
        {decryptedResult && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={decryptedResult.imageDataUrl}
                  alt="Decrypted Image"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <DialogClose asChild>
            <Button
              onClick={() => {
                handleDownloadImage();
                resetForm();
                toast.success('Gambar diunduh!');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Gambar Asli
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <BtnClear onClick={resetForm} />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
