import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner'; // tambahkan ini
import BtnClear from '../Elements/Button/BtnClear';

export default function DialogDownload({ showDialog, setShowDialog, handleDownload, resetForm, encryptedResult }) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <Dialog
      open={showDialog}
      onOpenChange={setShowDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enkripsi Berhasil!</DialogTitle>
          <DialogDescription>Gambar Anda telah berhasil dienkripsi menjadi gambar pixel acak.</DialogDescription>
        </DialogHeader>

        {/* Preview Images */}
        {encryptedResult && (
          <div className="space-y-4">
            {/* Toggle Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="flex items-center gap-2"
              >
                {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showOriginal ? 'Lihat Hasil Enkripsi' : 'Lihat Gambar Asli'}
              </Button>
            </div>

            {/* Image Preview */}
            <div className="flex flex-col items-center space-y-2">
              {showOriginal ? <DialogDescription>Gambar Asli:</DialogDescription> : <DialogDescription>Hasil Enkripsi (Pixel Acak):</DialogDescription>}{' '}
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={showOriginal ? encryptedResult.originalDataUrl : encryptedResult.scrambledDataUrl}
                  alt={showOriginal ? 'Original Image' : 'Scrambled Image'}
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
                handleDownload();
                resetForm();
                toast.success('Gambar diunduh!');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Gambar Terenkripsi
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
