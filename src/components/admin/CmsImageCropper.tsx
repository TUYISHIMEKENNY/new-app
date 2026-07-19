import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Check, X, RotateCcw } from "lucide-react";

interface CmsImageCropperProps {
  imageSrc: string;
  aspectRatio: number; // e.g. 16/9, 4/3, 1
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export function CmsImageCropper({ imageSrc, aspectRatio, onCrop, onCancel }: CmsImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset zoom and offset on image change
  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientX - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    // Calculate relative offsets
    const dx = e.clientX - dragStart.current.x;
    // We store clientY logic as well, but using clientX for start check. Let's make it correct:
  };

  // Correct drag handlers:
  const onStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - offset.x, y: clientY - offset.y };
  };

  const onDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setOffset({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    });
  };

  const onEndDrag = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const container = containerRef.current;

    // Viewport box dimensions
    const vWidth = container.clientWidth;
    const vHeight = container.clientHeight;

    const canvas = document.createElement("canvas");
    // Standard high-res target width
    const targetWidth = 1200;
    const targetHeight = targetWidth / aspectRatio;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Compute dimensions and offset translation
    const scaleFactor = targetWidth / vWidth;

    // Calculate how the image is drawn
    // Get actual sizes of image element
    const rect = img.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    // Relative positioned offset of image to container
    const imgX = (rect.left - cRect.left) * scaleFactor;
    const imgY = (rect.top - cRect.top) * scaleFactor;
    const imgW = rect.width * scaleFactor;
    const imgH = rect.height * scaleFactor;

    ctx.drawImage(img, imgX, imgY, imgW, imgH);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCrop(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  // Dynamic aspect ratio classes
  const viewportWidth = 440;
  const viewportHeight = viewportWidth / aspectRatio;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-paper border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <header className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
          <div>
            <h3 className="font-display text-lg text-foreground font-semibold">Crop Image</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Drag to reposition, use slider to zoom</p>
          </div>
          <button 
            onClick={onCancel}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Close cropper"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="p-6 flex flex-col items-center justify-center bg-cream/10">
          {/* Crop Viewport Window */}
          <div 
            ref={containerRef}
            style={{ width: `${viewportWidth}px`, height: `${viewportHeight}px`, maxWidth: "100%" }}
            className="relative overflow-hidden border-2 border-primary/50 bg-secondary/30 rounded-lg shadow-inner cursor-move select-none"
            onMouseDown={(e) => onStartDrag(e.clientX, e.clientY)}
            onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
            onMouseUp={onEndDrag}
            onMouseLeave={onEndDrag}
            onTouchStart={(e) => {
              if (e.touches[0]) onStartDrag(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) onDrag(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={onEndDrag}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              className="pointer-events-none select-none transition-transform duration-75"
            />
          </div>

          {/* Zoom Slider Controls */}
          <div className="w-full mt-6 flex items-center gap-4 bg-secondary/25 p-3 rounded-lg border border-border">
            <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="range"
              min="1"
              max="4"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
            
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="ml-2 p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Reset Zoom & Position"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-border bg-secondary/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className="bg-primary text-primary-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary/95 transition-colors shadow-sm"
          >
            <Check className="h-4 w-4" /> Apply Crop
          </button>
        </footer>
      </div>
    </div>
  );
}
