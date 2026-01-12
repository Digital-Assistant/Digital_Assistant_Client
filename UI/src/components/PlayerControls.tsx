import svgPathsDetail from "../imports/svg-0ikchrah8d";
import { IconButton } from "./IconButton";
import { useState, useEffect } from "react";

interface PlayerControlsProps {
  onSkipPrevious?: () => void;
  onPlay?: () => void;
  onSkipNext?: () => void;
  onPlaybackComplete?: () => void;
}

export function PlayerControls({ onSkipPrevious, onPlay, onSkipNext, onPlaybackComplete }: PlayerControlsProps) {
  // State: 'idle' | 'playing' | 'paused' | 'completed'
  const [playState, setPlayState] = useState<'idle' | 'playing' | 'paused' | 'completed'>('idle');

  // Simulate playback completion after 10 seconds for demo purposes
  useEffect(() => {
    if (playState === 'playing') {
      const timer = setTimeout(() => {
        setPlayState('completed');
        onPlaybackComplete?.();
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [playState, onPlaybackComplete]);

  const handlePlayPause = () => {
    if (playState === 'idle' || playState === 'paused') {
      setPlayState('playing');
      onPlay?.();
    } else if (playState === 'playing') {
      setPlayState('paused');
    } else if (playState === 'completed') {
      setPlayState('playing');
      onPlay?.();
    }
  };

  return (
    <div className="content-stretch flex gap-[10px] items-center px-0 py-4 rounded-[var(--widget-radius-sm)] w-full">
      {/* Skip Previous */}
      <IconButton 
        onClick={onSkipPrevious}
        size="lg"
        aria-label="Skip previous"
      >
        <div className="size-9">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
            <g clipPath="url(#clip0_skip_prev)">
              <path d={svgPathsDetail.p1e9080} fill="hsl(var(--widget-icon-disabled))" />
            </g>
            <defs>
              <clipPath id="clip0_skip_prev">
                <rect fill="white" height="36" width="36" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </IconButton>

      {/* Play/Pause/Restart Button */}
      <IconButton 
        onClick={handlePlayPause}
        size="lg"
        aria-label={
          playState === 'playing' ? 'Pause' :
          playState === 'completed' ? 'Restart' :
          'Play'
        }
      >
        <div className="size-[38px]">
          {/* Play Icon - Show when idle or paused */}
          {(playState === 'idle' || playState === 'paused') && (
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 38">
              <g clipPath="url(#clip0_play_filled)">
                <path d={svgPathsDetail.pb92c900} fill="hsl(var(--widget-icon-primary))" />
              </g>
              <defs>
                <clipPath id="clip0_play_filled">
                  <rect fill="white" height="38" width="38" />
                </clipPath>
              </defs>
            </svg>
          )}
          
          {/* Pause Icon - Show when playing */}
          {playState === 'playing' && (
            <svg className="block size-full" fill="none" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="15.8333" fill="hsl(var(--widget-icon-primary))" />
              <rect x="13" y="11" width="4" height="16" rx="1" fill="white" />
              <rect x="21" y="11" width="4" height="16" rx="1" fill="white" />
            </svg>
          )}
          
          {/* Restart Icon - Show when completed */}
          {playState === 'completed' && (
            <svg className="block size-full" fill="none" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="15.8333" fill="hsl(var(--widget-icon-primary))" />
              <path
                d="M19 11V14L23 10L19 6V9C15.6863 9 13 11.6863 13 15C13 16.0929 13.3145 17.1175 13.8575 18M19 27V24L15 28L19 32V29C22.3137 29 25 26.3137 25 23C25 21.9071 24.6855 20.8825 24.1425 20"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </IconButton>

      {/* Skip Next */}
      <IconButton 
        onClick={onSkipNext}
        size="lg"
        aria-label="Skip next"
      >
        <div className="size-9">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
            <g clipPath="url(#clip0_skip_next)">
              <path d={svgPathsDetail.p2d9db4e0} fill="hsl(var(--widget-icon-primary))" />
            </g>
            <defs>
              <clipPath id="clip0_skip_next">
                <rect fill="white" height="36" width="36" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </IconButton>
    </div>
  );
}