"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { uploadCatalogImage } from "@/app/gestion-alliance/catalog-actions";

type Props = {
  name: string;
  defaultValue?: string;
  label?: string;
  required?: boolean;
};

const ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif";

export default function ImageField({
  name,
  defaultValue = "",
  label = "Image principale",
  required = true,
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onUpload = async (file: File) => {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadCatalogImage(fd);
    setBusy(false);
    if (res.error || !res.url) {
      setError(res.error ?? "Échec upload");
      return;
    }
    setUrl(res.url);
  };

  return (
    <div className="space-y-3">
      <label htmlFor={name} className="block text-sm font-medium text-navy">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void onUpload(f);
        }}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition ${
          dragOver
            ? "border-green bg-green-soft/40"
            : "border-mist bg-sand/60"
        }`}
      >
        {url ? (
          <div className="relative aspect-[16/10] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-navy/75 px-3 py-2 backdrop-blur-sm">
              <p className="truncate text-caption text-white/80">Aperçu</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white/15 px-3 py-1.5 text-caption font-semibold text-white hover:bg-white/25"
              >
                Remplacer
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 px-4 py-10 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/8 text-navy">
              <ImagePlus size={22} />
            </span>
            <span className="text-sm font-semibold text-navy">
              {busy ? "Téléversement…" : "Glisser une image ou cliquer"}
            </span>
            <span className="text-caption text-muted">
              JPG, PNG, WebP, GIF, AVIF, HEIC — max 12 Mo
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onUpload(f);
        }}
      />

      <input
        id={name}
        name={name}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 focus:ring-2"
        placeholder="Ou coller une URL d’image…"
        required={required}
      />

      {!url ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-mist px-3 py-2 text-sm font-medium text-navy transition hover:bg-navy/5 disabled:opacity-60"
        >
          <Upload size={15} />
          {busy ? "Upload…" : "Choisir un fichier"}
        </button>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
