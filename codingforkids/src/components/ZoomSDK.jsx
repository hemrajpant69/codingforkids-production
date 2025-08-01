import React, { useEffect, useState } from 'react';

const ZoomSDK = ({ meetingNumber, password, userName, userEmail, zoomLink }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!meetingNumber) return;

    const initializeZoom = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🧪 Meeting Number:", meetingNumber);
        console.log("🔑 SDK Key:", import.meta.env.VITE_ZOOM_CLIENT_ID);

        // Load Zoom SDK script if not already present
        if (!window.ZoomMtg) {
          console.log("📦 Loading Zoom SDK...");
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://source.zoom.us/2.19.5/zoom-meeting-2.19.5.min.js';
            script.type = 'text/javascript';
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }

        const { ZoomMtg } = window;

        // Setup SDK Paths
        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.19.5/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();

        console.log("🔐 Fetching Zoom signature...");
        const res = await fetch(`https://codingforkidsnepal.com/api/zoom/signature?meetingNumber=${meetingNumber}&role=0`);
        const { signature } = await res.json();

        if (!signature) throw new Error("❌ No signature received from server");

        console.log("✅ Signature received:", signature);

        ZoomMtg.init({
          leaveUrl: window.location.href,
          disableCORP: true,
          success: () => {
            console.log("🟢 Zoom init success, trying to join...");

            ZoomMtg.join({
              signature,
              sdkKey: import.meta.env.VITE_ZOOM_CLIENT_ID,
              meetingNumber,
              userName: userName || "Student",
              userEmail: userEmail || '',
              passWord: password || '',
              success: () => {
                console.log("✅ Joined Zoom meeting!");
                setLoading(false);
              },
              error: (err) => {
                console.error("❌ Join error:", err);
                setError("Zoom join failed: " + (err.errorMessage || err.message || "Unknown error"));
                setLoading(false);
              }
            });
          },
          error: (err) => {
            console.error("❌ Init error:", err);
            setError("Zoom init failed: " + (err.errorMessage || err.message || "Unknown error"));
            setLoading(false);
          }
        });

      } catch (err) {
        console.error("🔥 Fatal error:", err);
        setError(err.message || 'Failed to join Zoom meeting');
        setLoading(false);
      }
    };

    initializeZoom();

    return () => {
      const zoomRoot = document.getElementById('zmmtg-root');
      if (zoomRoot) zoomRoot.innerHTML = '';
    };
  }, [meetingNumber, password, userName, userEmail]);

  if (error) {
    return (
      <div className="alert alert-danger p-3">
        <h5>Zoom Meeting Error</h5>
        <p>{error}</p>
        <a href={zoomLink} target="_blank" rel="noreferrer" className="btn btn-primary">
          Open Zoom Meeting in New Tab
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Zoom meeting...</span>
        </div>
        <span className="ms-2">Initializing Zoom meeting...</span>
      </div>
    );
  }

  return <div id="zmmtg-root" style={{ width: '100%', height: '100%' }} />;
};

export default ZoomSDK;
