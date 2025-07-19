import { Loader2, Unlock, AlertCircle } from 'lucide-react';
import CardBase from './CardBase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DecryptKey({ keyValue, setKey, handleDecrypt, selectedFile, isDecrypting, error }) {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleDecrypt();
    }
  };

  return (
    <CardBase
      title="Password"
      description="Password sebagai key untuk dekripsi"
    >
      <div className="min-h-15 mb-1">
        <Input
          type="text"
          value={keyValue}
          onChange={(e) => setKey(e.target.value)}
          className="text-xs"
          aria-label="Key Dekripsi"
          placeholder="key yang sama saat enkripsi"
          onKeyPress={handleKeyPress}
        />
        {error && (
          <span className="text-yellow-500 dark:text-yellow-500 text-[11px] flex text-red mt-1">
            <AlertCircle className="h-4" />
            {error}
          </span>
        )}
      </div>

      <Button
        onClick={handleDecrypt}
        disabled={!selectedFile || !keyValue.trim() || isDecrypting}
        className="text-xs w-full"
      >
        {isDecrypting ? <Loader2 className="animate-spin h-5 w-5" /> : <Unlock className="h-5 w-5" />}
        Dekripsi
      </Button>
    </CardBase>
  );
}
