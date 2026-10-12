"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { uploadCatalogImage } from "@/app/gestion-alliance/catalog-actions";

type Props = {
  name: string;
  label: string;
  defaultValue?: string[];
  helper?: string;
};

const ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif";

export default function MultiImageField({
  name,
  label,
  defaultValue = [],
  helper,
}: Props) {
  const [urls, setUrls] = useState(
    defaultValue.map((url) => url.trim()).filter(Boolean),
  );
  const [manualUrl, setManualUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addUrls = (nextUrls: string[]) => {
    setUrls((current) => [
      ...new Set([...current, ...nextUrls.map((url) => url.trim()).filter(Boolean)]),
    ]);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;

    setBusy(true);
    setError(null);

    const uploaded: string[] = [];
    for (const file of list) {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadCatalogImage(fd);
      if (res.error || !res.url) {
        setError(res.error ?? "Échec upload");
        continue;
      }
      uploaded.push(res.url);
    }

    if (uploaded.length) addUrls(uploaded);
    setBusy(false);
  };

  const removeUrl = (url: string) => {
    setUrls((current) => current.filter((item) => item !== url));
  };

  const addManualUrl = () => {
    if (!manualUrl.trim()) return;
    addUrls([manualUrl]);
    setManualUrl("");
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-navy">{label}</label>
        {helper ? <p className="mt-1 text-caption text-muted">{helper}</p> : null}
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          void uploadFiles(event.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-4 transition ${
          dragOver ? "border-green bg-green-soft/40" : "border-mist bg-sand/60"
        }`}
      >
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl px-4 py-6 text-center transition hover:bg-white/70 disabled:opacity-60"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/8 text-navy">
            <ImagePlus size={22} />
          </span>
          <span className="text-sm font-semibold text-navy">
            {busy ? "Téléversement..." : "Glisser plusieurs images ou cliquer"}
          </span>
          <span className="text-caption text-muted">
            Les images seront ajoutées à la galerie dans l&apos;ordre de sélection.
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          const files = event.target.files;
          if (files) void uploadFiles(files);
          event.currentTarget.value = "";
        }}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={manualUrl}
          onChange={(event) => setManualUrl(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 focus:ring-2"
          placeholder="Ou coller une URL d'image..."
        />
        <button
          type="button"
          onClick={addManualUrl}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist px-4 py-3 text-sm font-semibold text-navy transition hover:bg-navy/5"
        >
          <Upload size={15} />
          Ajouter
        </button>
      </div>

      {urls.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {urls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="overflow-hidden rounded-2xl border border-mist bg-white"
            >
              <div className="relative aspect-[4/3] bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-md bg-navy/80 px-2 py-1 text-[11px] font-bold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2">
                <p className="min-w-0 flex-1 truncate text-xs text-muted">{url}</p>
                <button
                  type="button"
                  onClick={() => removeUrl(url)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                  aria-label="Retirer l'image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-sand px-4 py-3 text-sm text-muted">
          Aucune image ajoutée pour cette galerie.
        </p>
      )}

      <textarea name={name} value={urls.join("\n")} readOnly hidden />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
