import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Lightbox({ item, items, onClose, onMove }) {
  const currentIndex = items.findIndex((candidate) => candidate.id === item?.id);

  useEffect(() => {
    if (!item) return undefined;

    document.body.classList.add("preview-open");
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onMove(-1);
      if (event.key === "ArrowRight") onMove(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("preview-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [item, onClose, onMove]);

  if (!item) return null;

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="lightbox-panel glass-panel">
        <button className="modal-close interactive-glow" onClick={onClose} type="button" aria-label="关闭预览">
          ×
        </button>
        <button className="modal-step prev interactive-glow" onClick={() => onMove(-1)} type="button" aria-label="上一张">
          ‹
        </button>
        <img alt={item.title} src={item.src} />
        <button className="modal-step next interactive-glow" onClick={() => onMove(1)} type="button" aria-label="下一张">
          ›
        </button>
        <div className="lightbox-caption glass-panel">
          <span>{String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <strong>{item.title}</strong>
          <small>{item.originalTitle} / {item.categoryLabel} / {item.year}</small>
        </div>
      </div>
    </div>,
    document.body
  );
}
