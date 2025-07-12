import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DialogDecrypt({ showDialog, setShowDialog, decryptedResult, handleDownloadImage, resetForm }) {
  return (
    <Dialog
      open={showDialog}
      onOpenChange={setShowDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Descripsi Berhasil!</DialogTitle>
          <DialogDescription>Gambar Anda telah berhasil didekripsi.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-5">
          <img
            src={decryptedResult}
            alt="Decrypted"
            className="max-w-full max-h-64 rounded-lg shadow-md"
          />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => handleDownloadImage()}
            variant="outline"
          >
            <Download className="h-5 w-5" />
            Download Gambar
          </Button>
          <DialogClose asChild>
            <Button
              onClick={resetForm}
              className="flex-1"
            >
              Reset
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
