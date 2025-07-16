import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CardBase from './CardBase';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function EncryptKey({ keyValue, setKey, handleEncrypt, selectedFile, isEncrypting, error, setError, customText, setCustomText }) {
  const isPasswordValid = (password) => password.length >= 6;
  const [isNote, setIsNote] = useState(false);

  return (
    <CardBase
      title="Password"
      description="Password akan digunakan sebagai key"
    >
      <div className="min-h-26.5 mb-1">
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
          className="text-xs mb-3"
        />

        {isNote ? (
          <Input
            id="customText"
            type="text"
            placeholder="Contoh: CONFIDENTIAL, PRIVATE, atau tulisan lainnya..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            maxLength={50}
            className="text-xs"
            autoFocus
          />
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsNote(true);
              document.getElementById('customText').focus();
            }}
            className="w-full text-xs"
          >
            Tambah Catatan (Opsional)
          </Button>
        )}

        {error && (
          <span className="text-yellow-500 dark:text-yellow-500 text-[11px] flex text-red mt-1">
            <AlertCircle className="h-4" />
            {error}
          </span>
        )}
      </div>

      <Button
        onClick={handleEncrypt}
        disabled={!selectedFile || !isPasswordValid(keyValue.trim()) || isEncrypting}
        className="text-xs w-full"
      >
        {isEncrypting ? <Loader2 className="animate-spin h-5 w-5" /> : <Lock className="h-5 w-5" />}
        Enkripsi
      </Button>
    </CardBase>
  );
}
