"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-surface-muted rounded-xl flex items-center justify-center text-ink-muted">
        <ImageOff size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square bg-surface-muted rounded-xl overflow-hidden mb-3">
        <img src={images[active]} alt={productName} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                active === i ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
