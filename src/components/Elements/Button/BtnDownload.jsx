import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function BtnDownload({ onClick, getDownloadText }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {getDownloadText()}
    </Button>
  );
}
