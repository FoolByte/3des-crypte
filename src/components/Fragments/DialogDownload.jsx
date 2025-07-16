import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Download, Paperclip } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          <div className="overflow-x-auto">
            <p className="text-sm w-55 whitespace-nowrap">{`${fileName}.enc`}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              handleDownload();
              setShowDialog(false);
            }}
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
              variant="outline"
            >
              Reset
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
