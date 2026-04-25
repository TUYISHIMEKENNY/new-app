import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { deletePhoto, listPhotos, uploadPhoto, type AdminPhoto } from "@/lib/admin-store";
import { Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setPhotos(await listPhotos());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const f of Array.from(files)) {
        await uploadPhoto(f, f.name.replace(/\.[^.]+$/, ""), "");
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onDelete = async (p: AdminPhoto) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    try {
      await deletePhoto(p.id, p.storage_path);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">Photo library</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {photos.length} photos · drag images below to upload.
          </p>
        </div>
      </div>

      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading) void onPick(e.dataTransfer.files);
        }}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-paper px-6 py-14 text-center transition-colors hover:border-primary hover:bg-secondary/20 ${
          uploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <Upload className="h-7 w-7 text-muted-foreground" />
        <p className="mt-4 font-display text-xl text-foreground">
          {uploading ? "Uploading…" : "Upload photos"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drop images here or click to browse · JPG, PNG, WEBP
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void onPick(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-4 border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <section className="mt-10">
        <h3 className="font-display text-2xl">In the gallery</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((p) => (
            <figure key={p.id} className="group border border-border bg-paper">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={p.src}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <button
                  onClick={() => onDelete(p)}
                  className="absolute right-2 top-2 rounded-full bg-foreground/80 p-1.5 text-background opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <figcaption className="p-4">
                <p className="font-display text-base text-foreground">{p.title}</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {p.caption || p.uploadedAt}
                </p>
              </figcaption>
            </figure>
          ))}
          {photos.length === 0 && !loading && (
            <p className="col-span-full py-16 text-center text-sm text-muted-foreground">
              No photos yet — upload some above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
