import { useEffect } from "react";
import { createPortal } from "react-dom";
import VideoPlayer from "./VideoPlayer.jsx";

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    if (!video) return undefined;

    document.body.classList.add("preview-open");
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("preview-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [video, onClose]);

  if (!video) return null;

  return createPortal(
    <div className="modal-backdrop video-backdrop" role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="video-detail glass-panel">
        <button className="modal-close interactive-glow" onClick={onClose} type="button" aria-label="关闭视频">
          ×
        </button>
        <div className="video-detail-header">
          <span>影像归档 / {video.categoryLabel}</span>
          <h3>{video.title}</h3>
          <p>{video.year} / {video.medium}</p>
        </div>
        <VideoPlayer video={video} />
        <div className="video-detail-copy">
          <p>{video.description}</p>
          <p>快捷键：空格播放或暂停，左右方向键前进或后退，M 静音。</p>
        </div>
        {video.gallery.length > 0 && (
          <div className="still-gallery" aria-label="视频静帧图集">
            {video.gallery.map((still, index) => (
              <img alt={`${video.title} 静帧 ${index + 1}`} key={still} loading="lazy" src={still} />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
