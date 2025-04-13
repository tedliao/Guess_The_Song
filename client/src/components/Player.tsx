import React, { useEffect, useRef } from 'react';
import { Quiz } from '../types';

export default function Player({ quiz }: { quiz: Quiz }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const player = new (window as any).YT.Player('yt-player', {
      videoId: new URLSearchParams(new URL(quiz.youtubeUrl).search).get('v'),
      events: {
        onReady: (e: any) => {
          e.target.seekTo(quiz.playStart);
          e.target.playVideo();
          setTimeout(() => {
            e.target.pauseVideo();
          }, (quiz.playEnd - quiz.playStart) * 1000);
        },
      },
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
      },
    });
  }, [quiz]);

  return <div id="yt-player" />;
}
