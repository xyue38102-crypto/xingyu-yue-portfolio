import { useEffect, useRef, useState } from "react";

const speeds = [0.5, 1, 1.25, 1.5, 2];

const formatTime = (value) => {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function VideoPlayer({ video }) {
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const lastProgressRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlay = () => {
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) {
      const playRequest = node.play?.();
      if (playRequest?.catch) playRequest.catch(() => {
        setIsPlaying(false);
        setIsBuffering(false);
      });
    } else {
      node.pause?.();
    }
  };

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;

    const syncPlayback = () => {
      setIsPlaying(!node.paused);
      setIsBuffering(false);
    };
    const syncMetadata = () => {
      setDuration(Number.isFinite(node.duration) ? node.duration : 0);
      setHasError(false);
    };
    const syncProgress = () => {
      const now = window.performance.now();
      if (now - lastProgressRef.current < 220) return;
      lastProgressRef.current = now;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        setCurrent(node.currentTime || 0);
      });
    };
    const handleWaiting = () => {
      if (!node.paused) setIsBuffering(true);
    };
    const handleError = () => {
      setHasError(true);
      setIsBuffering(false);
      setIsPlaying(false);
    };
    const resetForSource = () => {
      setCurrent(0);
      setDuration(0);
      setIsPlaying(false);
      setIsBuffering(false);
      setHasError(false);
    };

    resetForSource();
    const syncAll = () => {
      setCurrent(node.currentTime);
      setDuration(Number.isFinite(node.duration) ? node.duration : 0);
      setIsPlaying(!node.paused);
    };

    node.addEventListener("loadedmetadata", syncMetadata);
    node.addEventListener("durationchange", syncMetadata);
    node.addEventListener("timeupdate", syncProgress);
    node.addEventListener("seeking", syncProgress);
    node.addEventListener("seeked", syncProgress);
    node.addEventListener("play", syncPlayback);
    node.addEventListener("playing", syncPlayback);
    node.addEventListener("pause", syncPlayback);
    node.addEventListener("waiting", handleWaiting);
    node.addEventListener("stalled", handleWaiting);
    node.addEventListener("canplay", syncPlayback);
    node.addEventListener("error", handleError);
    syncAll();

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      node.pause?.();
      node.removeEventListener("loadedmetadata", syncMetadata);
      node.removeEventListener("durationchange", syncMetadata);
      node.removeEventListener("timeupdate", syncProgress);
      node.removeEventListener("seeking", syncProgress);
      node.removeEventListener("seeked", syncProgress);
      node.removeEventListener("play", syncPlayback);
      node.removeEventListener("playing", syncPlayback);
      node.removeEventListener("pause", syncPlayback);
      node.removeEventListener("waiting", handleWaiting);
      node.removeEventListener("stalled", handleWaiting);
      node.removeEventListener("canplay", syncPlayback);
      node.removeEventListener("error", handleError);
    };
  }, [video]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.volume = volume;
  }, [volume, video]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = muted;
  }, [muted, video]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.playbackRate = speed;
  }, [speed, video]);

  useEffect(() => {
    const handleKeys = (event) => {
      const node = videoRef.current;
      if (!node) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName)) return;
      if (event.key === " ") {
        event.preventDefault();
        togglePlay();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const value = Math.max(0, node.currentTime - 5);
        setCurrent(value);
        node.currentTime = value;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const value = Math.min(node.duration || 0, node.currentTime + 5);
        setCurrent(value);
        node.currentTime = value;
      }
      if (event.key.toLowerCase() === "m") setMuted((value) => !value);
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  const handleSeek = (event) => {
    const node = videoRef.current;
    if (!node) return;
    const value = Number(event.target.value);
    setCurrent(value);
    node.currentTime = value;
  };

  const handleVolume = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
  };

  const requestFullscreen = () => {
    const node = videoRef.current?.parentElement;
    if (node?.requestFullscreen) node.requestFullscreen();
  };

  return (
    <div className={`video-player ${isBuffering ? "is-buffering" : ""} ${hasError ? "has-error" : ""}`}>
      <video
        ref={videoRef}
        onClick={togglePlay}
        preload="metadata"
        poster={video.cover}
        src={video.src}
        playsInline
      />
      {(isBuffering || hasError) && (
        <div className="video-status glass-panel" aria-live="polite">
          {hasError ? "视频加载失败，请刷新页面或稍后重试" : "视频缓冲中"}
        </div>
      )}
      <div className="video-controls glass-panel">
        <button className="control-button interactive-glow" onClick={togglePlay} type="button">
          {isPlaying ? "暂停" : "播放"}
        </button>
        <span className="time-code">{formatTime(current)} / {formatTime(duration)}</span>
        <input
          aria-label="Video progress"
          className="progress-range interactive-glow"
          max={duration || 0}
          min="0"
          onChange={handleSeek}
          step="0.1"
          type="range"
          value={current}
        />
        <button className="control-button interactive-glow" onClick={() => setMuted((value) => !value)} type="button">
          {muted ? "静音" : "声音"}
        </button>
        <input
          aria-label="Volume"
          className="volume-range interactive-glow"
          max="1"
          min="0"
          onChange={handleVolume}
          step="0.01"
          type="range"
          value={muted ? 0 : volume}
        />
        <div className="speed-group" aria-label="Playback speed">
          {speeds.map((rate) => (
            <button
              className={`speed-button interactive-glow ${speed === rate ? "is-active" : ""}`}
              key={rate}
              onClick={() => setSpeed(rate)}
              type="button"
            >
              {rate}x
            </button>
          ))}
        </div>
        <button className="control-button interactive-glow" onClick={requestFullscreen} type="button">
          全屏
        </button>
      </div>
    </div>
  );
}
