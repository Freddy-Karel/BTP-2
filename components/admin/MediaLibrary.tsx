"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  deleteMediaFile,
  uploadMediaFile,
  type MediaItem,
} from "@/app/gestion-alliance/media-actions";
import { Copy, Trash2, Upload } from "lucide-react";

export default function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const onUpload = (file: File) => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadMediaFile(fd);
      if (res.error || !res.url) {
        setError(res.error ?? "Échec");
        return;
      }
      setItems((prev) => [
        { name: res.url!.split("/").pop() ?? file.name, url: res.url! },
        ...prev,
      ]);
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dashed border-navy/20 bg-white p-6 shadow-rest">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid disabled:opacity-60"
        >
          <Upload size={16} />
          {pending ? "Upload…" : "Téléverser une image"}
        </button>
        <p className="mt-2 text-caption text-muted">
          JPG, PNG, WebP — max 8 Mo. Copiez l’URL pour l’utiliser dans Contenu / Catalogue.
        </p>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.url}
            className="overflow-hidden rounded-2xl border border-mist bg-white shadow-rest"
          >
            <div className="relative aspect-[4/3] bg-mist">
              <Image src={item.url} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-caption text-muted">{item.name}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-mist px-2 py-2 text-caption font-medium text-navy hover:bg-navy/5"
                  onClick={() => void navigator.clipboard.writeText(item.url)}
                >
                  <Copy size={13} />
                  Copier URL
                </button>
                <form action={deleteMediaFile}>
                  <input type="hidden" name="name" value={item.name} />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      if (!confirm("Supprimer ce fichier ?")) e.preventDefault();
                      else {
                        setItems((prev) => prev.filter((i) => i.url !== item.url));
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Aucune image téléversée pour l’instant.</p>
      ) : null}
    </div>
  );
}
