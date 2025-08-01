// src/components/ZoomJoiner.jsx
import React, { useEffect } from 'react';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const ZoomJoiner = ({ meetingNumber, password, user }) => {
  useEffect(() => {
    const joinMeeting = async () => {
      try {
        const response = await fetch(`https://codingforkidsnepal.com/api/zoom/signature?meetingNumber=${meetingNumber}&role=0`);
        const { signature } = await response.json();

        ZoomMtg.init({
          leaveUrl: window.location.href,
          disableCORP: false,
          patchJsMedia: true,
          success: () => {
            ZoomMtg.join({
              signature,
              sdkKey: import.meta.env.VITE_ZOOM_CLIENT_ID,
              meetingNumber,
              userName: user?.name || "Student",
              userEmail: user?.email || "",
              passWord: password,
              success: () => {
                console.log("✅ Joined Zoom meeting successfully");
              },
              error: (err) => console.error("Join error", err),
            });
          },
          error: (err) => console.error("Init error", err),
        });
      } catch (error) {
        console.error("Signature or join error", error);
      }
    };

    if (meetingNumber) joinMeeting();
  }, [meetingNumber, password, user]);

  return <div id="zmmtg-root" style={{ width: "100%", height: "100vh" }} />;
};

export default ZoomJoiner;
