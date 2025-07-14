import { Loader2, Unlock, AlertCircle } from 'lucide-react';
import CardBase from './CardBase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DecryptKey({ keyValue, setKey, handleDecrypt, selectedFile, isDecrypting, error }) {
  return (
    <CardBase
      title="Password"
      description={'key yang sama saat enkripsi'}
    >
      <div className="flex items-center gap-5">
        <Input
          type="password"
          value={keyValue}
          onChange={(e) => setKey(e.target.value)}
          className="text-xs"
          aria-label="Key Dekripsi"
        />
        <Button
          variant="secondary"
          onClick={handleDecrypt}
          disabled={!selectedFile || !keyValue.trim() || isDecrypting}
          className="text-xs"
        >
          {isDecrypting ? <Loader2 className="animate-spin h-5 w-5" /> : <Unlock className="h-5 w-5" />}
          Dekripsi
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-red-700 dark:text-red-500 text-sm">{error}</span>
        </div>
      )}
    </CardBase>
  );
}
