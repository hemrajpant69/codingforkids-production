// src/components/ZoomMeeting.jsx
import React from 'react';

const ZoomMeeting = ({ zoomLink }) => {
  // Extract meeting ID and password from the Zoom link
  const getMeetingParams = () => {
    const url = new URL(zoomLink);
    const meetingId = url.pathname.split('/').pop();
    const password = url.searchParams.get('pwd') || '';
    return { meetingId, password };
  };

  const { meetingId, password } = getMeetingParams();
  
  // Generate the proper Zoom web client URL
  const webClientUrl = `https://zoom.us/wc/${meetingId}/join?pwd=${password}`;

  return (
    <div className="zoom-container" style={{ width: '100%', height: '100%' }}>
      <iframe
        src={webClientUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="camera; microphone; fullscreen; display-capture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        title="Zoom Meeting"
      />
    </div>
  );
};

export default ZoomMeeting;