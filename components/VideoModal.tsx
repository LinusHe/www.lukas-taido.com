import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Press } from '../types';
import BaseModal from './BaseModal';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pressItem: Press | null;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, pressItem }) => {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>();

  const getEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtu.be/')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }

    // Vimeo - use the same method as in the project
    if (url.includes('vimeo.com/')) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  const getVideoAspectRatio = async (url: string): Promise<number | undefined> => {
    try {
      // For Vimeo, we can try to get the aspect ratio from the oEmbed API
      if (url.includes('vimeo.com/')) {
        const videoId = url.split("/").pop();
        const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
        const response = await fetch(oembedUrl);
        const data = await response.json();

        if (data.width && data.height) {
          return data.height / data.width;
        }
      }

      // For YouTube, we could use the YouTube Data API, but that requires an API key
      // For now, we'll use a default aspect ratio
      if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
        return 0.5625; // 16:9 default
      }
    } catch (error) {
      console.warn('Could not fetch video aspect ratio:', error);
    }

    return undefined; // Fallback to default
  };

  // Load aspect ratio when video URL changes
  useEffect(() => {
    if (pressItem?.videoUrl) {
      getVideoAspectRatio(pressItem.videoUrl).then(setAspectRatio);
    }
  }, [pressItem?.videoUrl]);

  if (!pressItem || !pressItem.videoUrl) return null;

  const documentTitle = pressItem.title || 'Video';
  const embedUrl = getEmbedUrl(pressItem.videoUrl);

  console.log('Video URL:', pressItem.videoUrl);
  console.log('Embed URL:', embedUrl);
  console.log('Aspect Ratio:', aspectRatio);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Video: ${documentTitle}`}
    >
      <VideoWrapper aspectRatio={aspectRatio}>
        <VideoFallback>
          <p>Loading video...</p>
          <p>If the video doesn't appear, click <a href={pressItem.videoUrl} target="_blank" rel="noopener noreferrer">here</a> to open it directly.</p>
        </VideoFallback>
        <iframe
          src={embedUrl}
          title={documentTitle}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={(e) => console.error('Video load error:', e)}
          onLoad={() => console.log('Video loaded successfully')}
        />
      </VideoWrapper>
    </BaseModal>
  );
};

const VideoWrapper = styled.div<{ aspectRatio?: number; }>`
  position: relative;
  width: calc(100vw - 40px);
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: #000;
  flex-shrink: 0;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio ? `1 / ${aspectRatio}` : '16 / 9'};

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
`;

const VideoFallback = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  color: white;
  text-align: center;
  padding: 20px;
  z-index: -1;

  p {
    margin: 10px 0;
  }

  a {
    color: #4a9eff;
    text-decoration: underline;
    
    &:hover {
      color: #6bb3ff;
    }
  }
`;

export default VideoModal; 