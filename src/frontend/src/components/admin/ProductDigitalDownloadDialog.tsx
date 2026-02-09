import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetDigitalDownload, useRemoveDigitalDownload } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import type { Product } from '../../backend';

interface ProductDigitalDownloadDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDigitalDownloadDialog({ product, open, onOpenChange }: ProductDigitalDownloadDialogProps) {
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState(product.digitalDownload?.contentType || 'application/pdf');
  const [downloadLimit, setDownloadLimit] = useState(product.digitalDownload?.downloadLimit?.toString() || '');
  const [uploadProgress, setUploadProgress] = useState(0);

  const setDigitalDownload = useSetDigitalDownload();
  const removeDigitalDownload = useRemoveDigitalDownload();

  const handleFileToBlob = async (file: File): Promise<ExternalBlob> => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array);
    return blob.withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });
  };

  const handleSave = async () => {
    if (!downloadFile && !product.digitalDownload) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!contentType) {
      toast.error('Please enter a content type');
      return;
    }

    try {
      let downloadFileBlob: ExternalBlob;
      
      if (downloadFile) {
        downloadFileBlob = await handleFileToBlob(downloadFile);
      } else if (product.digitalDownload) {
        downloadFileBlob = product.digitalDownload.downloadFile;
      } else {
        toast.error('No file available');
        return;
      }

      await setDigitalDownload.mutateAsync({
        productId: product.id,
        download: {
          downloadFile: downloadFileBlob,
          contentType,
          fileSizeBytes: BigInt(downloadFile?.size || Number(product.digitalDownload?.fileSizeBytes || 0)),
          downloadLimit: downloadLimit ? BigInt(downloadLimit) : undefined,
        },
      });

      toast.success('Digital download saved successfully!');
      setDownloadFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save digital download');
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeDigitalDownload.mutateAsync(product.id);
      toast.success('Digital download removed successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to remove digital download');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Digital Download</DialogTitle>
          <DialogDescription>
            Configure the downloadable file for "{product.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="download-file">Download File</Label>
            <Input
              id="download-file"
              type="file"
              onChange={(e) => setDownloadFile(e.target.files?.[0] || null)}
            />
            {product.digitalDownload && !downloadFile && (
              <p className="text-sm text-muted-foreground">
                Current file: {(Number(product.digitalDownload.fileSizeBytes) / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Input
              id="content-type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              placeholder="e.g., application/pdf, application/zip"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="download-limit">Download Limit (Optional)</Label>
            <Input
              id="download-limit"
              type="number"
              value={downloadLimit}
              onChange={(e) => setDownloadLimit(e.target.value)}
              placeholder="Leave empty for unlimited"
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-vibrant-magenta h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {product.digitalDownload && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removeDigitalDownload.isPending}
            >
              {removeDigitalDownload.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={setDigitalDownload.isPending || (uploadProgress > 0 && uploadProgress < 100)}
          >
            {setDigitalDownload.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
