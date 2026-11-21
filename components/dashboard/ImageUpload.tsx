"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const MAX_BYTES = 5 * 1024 * 1024;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint = "JPG, PNG or WebP up to 5 MB.",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large", {
        description: "The maximum size is 5 MB.",
      });
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const result = await apiFetch<{ url: string; deleteUrl?: string }>(
        "/api/uploads",
        {
          method: "POST",
          body: JSON.stringify({ image: dataUrl, name: file.name }),
        },
      );
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not upload the image.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium">{label}</span>

      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-input/40 p-3 sm:flex-row sm:items-center">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Selected preview"
              className="size-full object-cover"
            />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UploadCloud className="size-3.5" />
              )}
              {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
            </Button>

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onChange("")}
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            )}
          </div>
          <p className="mt-2 text-[0.7rem] leading-relaxed text-muted-foreground">
            {hint}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
    </div>
  );
}
