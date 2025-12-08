import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ScanFace, Loader2, AlertTriangle } from 'lucide-react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

interface GestureControllerProps {
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
}

const GestureController: React.FC<GestureControllerProps> = ({ onZoomChange, currentZoom }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [handDistance, setHandDistance] = useState<number | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading MediaPipe Vision...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        console.log("MediaPipe Model Loaded Successfully");
        setModelStatus('ready');
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
        setModelStatus('error');
      }
    };
    loadModel();
  }, []);

  const startCamera = async () => {
    if (modelStatus !== 'ready') return;
    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
             console.log("Camera data loaded, starting predictions");
             setIsCameraActive(true);
             predictWebcam();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền truy cập hoặc kết nối HTTPS.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setHandDistance(null);
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
    }
  };

  const predictWebcam = () => {
    if (!handLandmarkerRef.current || !videoRef.current || !videoRef.current.videoWidth) return;
    
    // Only detect if video time has changed
    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = videoRef.current.currentTime;
        
        try {
            const startTimeMs = performance.now();
            const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];
              
              // Points: 4 (Thumb Tip), 8 (Index Finger Tip)
              const thumbTip = landmarks[4];
              const indexTip = landmarks[8];
              
              // Calculate distance
              const distance = Math.sqrt(
                Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
              );

              setHandDistance(distance);

              // Map distance to Zoom Level logic
              const minD = 0.03;
              const maxD = 0.20;
              const normalized = Math.max(0, Math.min(1, (distance - minD) / (maxD - minD)));
              
              // Calculate target zoom (0.5 to 3.0)
              const targetZoom = 0.5 + (normalized * 2.5);
              onZoomChange(targetZoom);
            } else {
              setHandDistance(null);
            }
        } catch (e) {
            console.error("Prediction error:", e);
        }
    }

    if (isCameraActive || videoRef.current.srcObject) {
        requestRef.current = requestAnimationFrame(predictWebcam);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Control Button */}
      <div className="flex items-center gap-2">
         {modelStatus === 'loading' && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-yellow-500/50">
                <Loader2 size={14} className="animate-spin text-yellow-500" />
                <span className="text-xs text-yellow-500 font-mono">ĐANG TẢI AI...</span>
            </div>
         )}
         
         {modelStatus === 'error' && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-red-500/50">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-xs text-red-500 font-mono">LỖI AI</span>
            </div>
         )}

         <button
            onClick={isCameraActive ? stopCamera : startCamera}
            disabled={modelStatus !== 'ready'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all shadow-lg
              ${isCameraActive 
                ? 'bg-red-500/20 border-red-500 text-red-100 hover:bg-red-500/40 shadow-red-500/20' 
                : modelStatus === 'ready'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-100 hover:bg-cyan-500/40 shadow-cyan-500/20'
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {isCameraActive ? <CameraOff size={18} /> : <Camera size={18} />}
            <span className="text-sm font-bold font-mono">
              {isCameraActive ? 'TẮT CAMERA' : 'ĐIỀU KHIỂN CỬ CHỈ'}
            </span>
          </button>
      </div>

      {/* Camera Feed - Only visible when active */}
      <div className={`transition-all duration-500 ease-in-out origin-top-right overflow-hidden relative
          ${isCameraActive ? 'w-48 h-36 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-0'}`}>
        
        <div className="w-full h-full bg-black border-2 border-cyan-500 rounded-lg relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
            
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-[1px] bg-cyan-500/50 absolute top-4 animate-pulse"></div>
                <div className="w-full h-[1px] bg-cyan-500/50 absolute bottom-4 animate-pulse"></div>
                
                {handDistance !== null ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute top-1 right-1 bg-black/60 px-1 rounded text-[10px] font-mono text-green-400 border border-green-500/30">
                            DETECTED
                        </div>
                        <div className="text-cyan-400 font-mono text-sm font-bold bg-black/70 px-2 py-1 rounded backdrop-blur">
                            ZOOM: {currentZoom.toFixed(1)}x
                        </div>
                        {/* Visual Feedback Ring */}
                        <div 
                            className="absolute border-2 border-cyan-400 rounded-full transition-all duration-100 opacity-60 shadow-[0_0_10px_#00f0ff]"
                            style={{
                                width: `${Math.min(100, Math.max(20, handDistance * 400))}px`,
                                height: `${Math.min(100, Math.max(20, handDistance * 400))}px`
                            }}
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500/50 animate-pulse">
                        <ScanFace className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-mono">SCANNING HAND...</span>
                    </div>
                )}
            </div>
        </div>
      </div>

        {/* Instructions */}
        {isCameraActive && (
            <div className="bg-black/80 backdrop-blur border border-cyan-500/30 p-2 rounded text-[10px] text-cyan-300 max-w-[200px] text-center font-mono">
                Mở ngón cái & trỏ: <span className="text-white">Zoom In</span><br/>
                Khép lại: <span className="text-white">Zoom Out</span>
            </div>
        )}
    </div>
  );
};

export default GestureController;