"use client";

import React from "react";
import ReactPlayer from "react-player";

function VideoPlayer({ lang }: { lang: string }) {
  // video path
  const srcEn =
    "https://ekpmatfeiuefdxdsvoza.supabase.co/storage/v1/object/public/demo/Ollabot-En-Introduction.mp4?t=2024-05-03T21%3A58%3A13.553Z";
  const srcFr =
    "https://ekpmatfeiuefdxdsvoza.supabase.co/storage/v1/object/public/demo/Ollabot-Fr-Presentation.mp4?t=2024-05-03T21%3A58%3A31.148Z";
  const videosrc = lang === "en" ? srcEn : srcFr;

  return (
    <div>
      <ReactPlayer
        controls
        height="auto"
        light={false}
        pip
        // picture in picture
        url={videosrc}
        // light is usefull incase of dark mode
        width="auto"
      />
      <source src={videosrc} type="video/mp4" />
    </div>
  );
}

export default VideoPlayer;
