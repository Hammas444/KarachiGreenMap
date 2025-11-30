// "use client";

// import { useRef, useState } from "react";
// import { Button } from "@/components/ui/button";

// export default function CameraCapture({ onCapture }) {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const [streaming, setStreaming] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);

//   // Start camera
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//       videoRef.current.srcObject = stream;
//       setStreaming(true);
//     } catch (err) {
//       console.error("Camera access denied:", err);
//     }
//   };

//   // Capture image
//   const takePicture = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     const width = video.videoWidth;
//     const height = video.videoHeight;

//     canvas.width = width;
//     canvas.height = height;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, width, height);

//     const imageData = canvas.toDataURL("image/png");
//     setCapturedImage(imageData);

//     // Pass image data to parent (upload etc.)
//     if (onCapture) onCapture(imageData);
//   };

//   // Stop camera
//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     setStreaming(false);
//   };

//   return (
//     <div className="space-y-3">
//       {!streaming && !capturedImage && (
//         <Button onClick={startCamera}>📸 Open Camera</Button>
//       )}

//       {streaming && (
//         <div className="space-y-3">
//           <video
//             ref={videoRef}
//             autoPlay
//             className="w-full rounded-lg border"
//           />

//           <div className="flex gap-2">
//             <Button onClick={takePicture}>✔ Capture</Button>
//             <Button variant="destructive" onClick={stopCamera}>
//               ✖ Stop
//             </Button>
//           </div>
//         </div>
//       )}

//       {capturedImage && (
//         <div className="space-y-3">
//           <img
//             src={capturedImage}
//             className="w-full rounded-lg border"
//             alt="Captured"
//           />

//           <div className="flex gap-2">
//             <Button onClick={startCamera}>Retake</Button>
//             <Button variant="destructive" onClick={() => setCapturedImage(null)}>
//               Remove
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Hidden canvas for screenshot */}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// }
"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // back camera on mobile
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setStream(null);
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");
    setCapturedImage(img);
    stopCamera();

    if (onCapture) onCapture(img);
  };

  return (
    <div className="space-y-3">

      {/* START BUTTON */}
      {!stream && !capturedImage && (
        <Button onClick={startCamera}>📸 Open Camera</Button>
      )}

      {/* LIVE VIDEO */}
      {stream && (
        <div className="space-y-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted   // REQUIRED for iPhone and Chrome autoplay
            className="w-full rounded-lg border"
          />
          <div className="flex gap-2">
            <Button onClick={takePicture}>✔ Capture</Button>
            <Button variant="destructive" onClick={stopCamera}>
              ✖ Stop
            </Button>
          </div>
        </div>
      )}

      {/* PREVIEW AFTER CAPTURE */}
      {capturedImage && (
        <div className="space-y-3">
          <img src={capturedImage} className="w-full rounded-lg border" />
          <div className="flex gap-2">
            <Button onClick={startCamera}>Retake</Button>
            <Button
              variant="destructive"
              onClick={() => setCapturedImage(null)}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
