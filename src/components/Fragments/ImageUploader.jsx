import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';

import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ImageUploader({ onFileChange, resetTrigger, maxSize }) {
  const [{ files, isDragging, errors }, { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps, clearFiles }] = useFileUpload({
    accept: 'image/png,image/jpeg',
    maxSize,
  });
  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  useEffect(() => {
    clearFiles();
  }, [resetTrigger, clearFiles]);

  useEffect(() => {
    if (files[0]?.file) {
      onFileChange?.(files[0].file, files[0].preview);
    } else {
      onFileChange?.(null, null);
    }
  }, [files, onFileChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed  transition-colors has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || 'Uploaded image'}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="text-sm font-medium">Unggah gambar Anda di sini</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Klik untuk memilih gambar
              </Button>
            </div>
          )}
        </div>

        {/* Image preview name */}
        <p className="text-sm text-center break-words mt-3 text-muted-foreground line-clamp-2">{fileName && fileName.length > 50 ? `${fileName.substring(0, 50)}...` : fileName}</p>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon
                className="size-4"
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
