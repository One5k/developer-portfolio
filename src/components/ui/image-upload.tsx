import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled,
    className,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        try {
            const res = await uploadApi.uploadFile(file);
            if (res.success && res.url) {
                onChange(res.url);
                toast({ title: "Image uploaded successfully" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Upload failed", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsUploading(false);
            // Reset input so same file can be selected again
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
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-border group bg-muted/20">
                        <img
                            src={value}
                            alt="Upload"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                            onClick={handleRemove}
                            disabled={disabled}
                            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="w-40 h-40 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/5 gap-2 text-muted-foreground">
                        <Upload className="h-8 w-8 opacity-50" />
                        <span className="text-xs">No image</span>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        accept="image/*"
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
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Max size 5MB. Formats: JPG, PNG, WEBP.
                    </p>
                </div>
            </div>
        </div>
    );
};
