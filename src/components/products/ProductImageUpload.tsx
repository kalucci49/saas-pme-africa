"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X } from "lucide-react";

export function ProductImageUpload({
  organizationId,
  value,
  onChange,
}: {
  organizationId: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${organizationId}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });

      if (error) {
        alert(`Erreur d'envoi : ${error.message}`);
        return;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm text-gray-600">Photo</label>
      <div className="mt-1">
        {value ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Produit" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              aria-label="Retirer la photo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
            <ImagePlus size={22} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">
              {uploading ? "Envoi en cours..." : "Ajouter une photo"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
