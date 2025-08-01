import React, { useState, useRef } from 'react';
import { FaSpinner, FaExclamationTriangle, FaExpand, FaCompress } from 'react-icons/fa';

const SimpleZoom = ({ zoomLink }) => {
  const [loading, setLoading] = useState(true);
  const [zoomError, setZoomError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const getMeetingParams = () => {
    if (!zoomLink) return { meetingId: null, password: null };
    try {
      const url = new URL(zoomLink);
      const meetingId = url.pathname.split('/').pop();
      const password = url.searchParams.get('pwd') || '';
      return { meetingId, password };
    } catch {
      return { meetingId: null, password: null };
    }
  };

  const { meetingId, password } = getMeetingParams();
  const webClientUrl = `https://zoom.us/wc/${meetingId}/join${password ? `?pwd=${password}` : ''}`;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  if (!meetingId) {
    return (
      <div className="alert alert-danger p-3 text-center">
        <FaExclamationTriangle className="me-2" />
        Invalid Zoom link format
      </div>
    );
  }

  return (
    <div className="position-relative w-100 h-100" ref={containerRef}>
      {loading && (
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <FaSpinner className="fa-spin fs-1 text-primary" />
          <p className="mt-2">Loading Zoom meeting...</p>
        </div>
      )}

      <button
        className="btn btn-outline-secondary position-absolute top-0 end-0 m-2 z-1"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />}
      </button>

      <iframe
        ref={iframeRef}
        src={webClientUrl}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setZoomError('Failed to load Zoom meeting');
        }}
        style={{ width: '100%', height: '100%', border: 'none', display: loading ? 'none' : 'block' }}
        allow="camera; microphone; fullscreen;  autoplay"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Zoom Meeting"
      />

      {zoomError && (
        <div className="position-absolute top-50 start-50 translate-middle text-center bg-white p-4 rounded shadow">
          <FaExclamationTriangle className="text-danger fs-1 mb-3" />
          <h5>Zoom Meeting Error</h5>
          <p className="mb-3">{zoomError}</p>
          <a href={zoomLink} target="_blank" rel="noreferrer" className="btn btn-primary">
            Open in Zoom App
          </a>
        </div>
      )}
    </div>
  );
};

export default SimpleZoom;
