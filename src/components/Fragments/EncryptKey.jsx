import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CardBase from './CardBase';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

export default function EncryptKey({ keyValue, setKey, handleEncrypt, selectedFile, isEncrypting, error, setError }) {
  return (
    <CardBase
      title="Password"
      description="Password akan digunakan sebagai key"
    >
      <div className="flex items-center gap-5">
        <Input
          type="text"
          value={keyValue}
          onChange={(e) => {
            const value = e.target.value;
            setKey(value);
            if (value.length < 6) {
              setError(`Key minimal 6 karakter.  ${6 - value.length} karakter lagi.`);
            } else if (error) {
              setError('');
            }
          }}
          placeholder="Minimal 6 karakter"
          className="text-xs"
        />

        <Button
          onClick={handleEncrypt}
          disabled={!selectedFile || !keyValue.trim() || isEncrypting}
          className="text-xs"
        >
          {isEncrypting ? <Loader2 className="animate-spin h-5 w-5" /> : <Lock className="h-5 w-5" />}
          Enkripsi
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          <span className="text-yellow-700 dark:text-yellow-500 text-sm">{error}</span>
        </div>
      )}
    </CardBase>
  );
}
