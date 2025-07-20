import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function BtnShow({ showOriginal, onClick }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
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
    </Button>
  );
}
