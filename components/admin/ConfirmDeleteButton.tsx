"use client";

import { Trash2 } from "lucide-react";

export default function ConfirmDeleteButton({
  action,
  id,
  label = "Supprimer",
  message = "Confirmer la suppression ?",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string | number;
  label?: string;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        <Trash2 size={14} />
        {label}
      </button>
    </form>
  );
}
