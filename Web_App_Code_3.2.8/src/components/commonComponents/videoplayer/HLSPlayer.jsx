'use client'

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ url, autoPlay = true, controls = true, muted = false, className = '' }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setError(null);
    let hls = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              // Autoplay prevented by browser policy (needs muted or user gesture)
              console.warn("Autoplay prevented:", err?.message || err);
            });
          }
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("HLS network error encountered, attempting recovery...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("HLS media error encountered, attempting recovery...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable HLS error:", data);
              setError("Live stream playback encountered an error. Please try again later.");
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS support
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) {
          video.play().catch((err) => {
            console.warn("Native Safari autoplay prevented:", err?.message || err);
          });
        }
      });
      video.addEventListener('error', () => {
        setError("Live stream playback error on this device.");
      });
    } else {
      setError("HLS playback is not supported on this browser.");
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [url, autoPlay]);

  if (error) {
    return (
      <div className="w-full h-64 bg-black/90 rounded-xl flex items-center justify-center text-center p-6 text-gray-300">
        <div>
          <p className="text-sm font-semibold mb-2">{error}</p>
          <button
            onClick={() => { setError(null); }}
            className="text-xs bg-[#af2c2c] text-white px-3 py-1.5 rounded uppercase font-bold hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className={`videoCanvas w-full rounded-xl bg-black ${className}`}
      controls={controls}
      playsInline={true}
      muted={muted}
      autoPlay={autoPlay}
      style={{ maxHeight: '560px' }}
    />
  );
};

export default React.memo(VideoPlayer);
