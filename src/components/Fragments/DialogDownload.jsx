import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Download, Paperclip } from 'lucide-react';
import TypoP from '../Typography/TypoP';
import { Button } from '@/components/ui/button';

export default function DialogDownload({ showDialog, setShowDialog, handleDownload, fileName, resetForm }) {
  return (
    <Dialog
      open={showDialog}
      onOpenChange={setShowDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Enkripsi Berhasil!</DialogTitle>
          <DialogDescription>Silakan unduh file hasil enkripsi Anda.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-end gap-5">
            <Paperclip className="h-5 w-5 text-gray-500" />
            <TypoP>{`${fileName}.enc`}</TypoP>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              handleDownload();
              setShowDialog(false);
            }}
            variant="outline"
          >
            <Download className="h-5 w-5" />
            Download File .enc
          </Button>

          <DialogClose asChild>
            <Button
              onClick={() => {
                resetForm();
                setShowDialog(false);
              }}
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
