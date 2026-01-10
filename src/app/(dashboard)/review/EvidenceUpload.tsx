'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { InsertTables } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EvidenceUploadProps {
  goalId: string;
  userId: string;
}

export default function EvidenceUpload({ goalId, userId }: EvidenceUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Manually set the file input
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setUploading(true);
    const file = fileInputRef.current.files[0];
    const supabase = createClient();

    // Upload file to storage
    const fileName = `${userId}/${goalId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('evidence')
      .getPublicUrl(fileName);

    // Create evidence record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newEvidence: InsertTables<'evidence'> = {
      micro_goal_id: goalId,
      user_id: userId,
      image_url: urlData.publicUrl,
      caption: caption || null,
      expires_at: expiresAt.toISOString(),
    };

    const { error: insertError } = await supabase
      .from('evidence')
      .insert(newEvidence as any);

    if (insertError) {
      console.error('Insert error:', insertError);
    }

    setUploading(false);
    setPreview(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    router.refresh();
  };

  const cancelUpload = () => {
    setPreview(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {preview ? (
        <div className="space-y-4 p-4 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-start gap-4">
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl shadow-lg ring-2 ring-green-200"
              />
              <button
                onClick={cancelUpload}
                className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Imagen lista para subir</span>
              </div>
              
              <Input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Agregar descripción (opcional)"
                className="border-green-200 focus:border-green-500 bg-white"
              />
              
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-105 transition-all"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Subir evidencia
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all duration-300",
            isDragOver 
              ? "border-primary bg-primary/5 scale-105" 
              : "border-border hover:border-primary/50"
          )}
        >
          <label className="flex flex-col items-center justify-center p-8 cursor-pointer group">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 group-hover:scale-110 transition-transform mb-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Subir foto de evidencia
              </p>
              <p className="text-xs text-muted-foreground">
                Haz clic o arrastra tu imagen aquí
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG hasta 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
