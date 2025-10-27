import React, { createContext, useContext, useEffect, useState, useRef } from "react";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = "UCwQnQZ6yFQwZ5qX6Ch12RSg";

// eslint-disable-next-line react-refresh/only-export-components
export const YouTubeContext = createContext();

export function YouTubeProvider({ children, setApiStatus }) {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    async function fetchLatestLivestream() {
      if (setApiStatus) setApiStatus("Loading...");
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&order=date&maxResults=1&key=${YOUTUBE_API_KEY}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setVideoId(data.items[0].id.videoId);
          if (setApiStatus) setApiStatus("Success!");
        } else {
          if (setApiStatus) setApiStatus("No live video found.");
        }
      } catch {
        if (setApiStatus) setApiStatus("API Error");
      }
    }
    fetchLatestLivestream();
  }, [setApiStatus]);

  return (
    <YouTubeContext.Provider value={{ videoId }}>
      {children}
    </YouTubeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useYouTube() {
  return useContext(YouTubeContext);
}

export function YouTubeEmbed({ height = "390", width = "640" }) {
  const { videoId } = useYouTube();
  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    function createPlayer() {
      if (playerRef.current) {
        playerInstance.current = new window.YT.Player(playerRef.current, {
          height,
          width,
          videoId,
        });
      }
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else if (window.YT && window.YT.Player) {
      createPlayer();
    }

    return () => {
      if (playerInstance.current && playerInstance.current.destroy) {
        playerInstance.current.destroy();
      }
    };
  }, [videoId, height, width]);

  return <div ref={playerRef}></div>;
}

export function YouTubeLink() {
  const { videoId } = useYouTube();
  if (!videoId) return null;
  return (
    <div style={{ marginTop: "1rem" }}>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch on YouTube
      </a>
    </div>
  );
}
