import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, FileText } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  disabled,
  className,
  accept = 'application/pdf',
  maxSizeMB = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: language === 'ar' ? 'الملف كبير جداً' : 'File too large',
        description: language === 'ar' ? `الحد الأقصى هو ${maxSizeMB} ميجابايت.` : `Max file size is ${maxSizeMB}MB.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadApi.uploadFile(file);
      if (res.success && res.url) {
        onChange(res.url);
        toast({
          title: language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: language === 'ar' ? 'فشل الرفع' : 'Upload failed',
        description: language === 'ar' ? 'حدث خطأ أثناء رفع الملف.' : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/20 group max-w-sm">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate text-muted-foreground max-w-[180px]">
                {value.split('/').pop() || 'Uploaded File'}
              </p>
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline hover:text-primary/80">
                {language === 'ar' ? 'عرض الملف' : 'View File'}
              </a>
            </div>
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="p-1 rounded-full text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs p-4 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/5 gap-2 text-muted-foreground">
            <FileText className="h-8 w-8 opacity-50" />
            <span className="text-xs">{language === 'ar' ? 'لم يتم تحديد ملف' : 'No file selected'}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'رفع ملف PDF' : 'Upload PDF'}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? `الملفات المسموحة: PDF فقط، حتى ${maxSizeMB} ميجابايت.` : `Allowed: PDF only, up to ${maxSizeMB}MB.`}
          </p>
        </div>
      </div>
    </div>
  );
};
