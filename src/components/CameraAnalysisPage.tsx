
import React, { useState, useRef, useEffect } from 'react';

interface CameraAnalysisPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const CameraAnalysisPage: React.FC<CameraAnalysisPageProps> = ({ onBack, onContinue }) => {
  const [currentScreen, setCurrentScreen] = useState<'selection' | 'camera' | 'analysis'>('selection');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState('Analizando tu rostro...');
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [scanPosition, setScanPosition] = useState(100); // % from bottom
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faceParts = ['cara', 'frente', 'ojos', 'nariz', 'boca', 'barbilla'];

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Bind stream to video element when screen changes to 'camera'
  useEffect(() => {
    if (currentScreen === 'camera' && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.play().catch(e => console.error("Error playing video:", e));
    }
  }, [currentScreen]);

  // Handle Analysis Start: Wait for screen to be 'analysis' and image to be present
  useEffect(() => {
    if (currentScreen === 'analysis' && capturedImage && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
            // Double check ref availability
            if (canvasRef.current) {
                // Set canvas size to match image natural size for correct aspect ratio
                canvasRef.current.width = img.width;
                canvasRef.current.height = img.height;
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    startAnalysis();
                }
            }
        };
        img.src = capturedImage;
    }
  }, [currentScreen, capturedImage]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Initialize Camera
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        }, 
        audio: false 
      });
      
      streamRef.current = stream;
      setCurrentScreen('camera');
    } catch (error) {
      console.error('Error accessing camera:', error);
      showError('No se pudo acceder a la cámara. Por favor, verifica los permisos en tu navegador.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
            // Set the image data state first
            setCapturedImage(e.target.result as string);
            // Then switch screen. The useEffect above will handle drawing when the canvas renders.
            setCurrentScreen('analysis');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = video.videoWidth;
      captureCanvas.height = video.videoHeight;
      
      const ctx = captureCanvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.translate(captureCanvas.width, 0);
        ctx.scale(-1, 1); // Mirror effect
        ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
        ctx.restore();
        
        setCapturedImage(captureCanvas.toDataURL('image/png'));
        stopCamera();
        setCurrentScreen('analysis');
      }
    }
  };

  const startAnalysis = () => {
    setIsAnalysisComplete(false);
    setScanPosition(100);
    setAnalysisStatus('Analizando tu cara...');
    
    let currentPos = 100;
    let currentPartIndex = 0;
    const speed = 0.7; 

    const interval = setInterval(() => {
      currentPos -= speed;
      setScanPosition(currentPos);

      const progress = 100 - currentPos;
      const partThresholds = [20, 40, 50, 60, 70, 80];
      
      if (currentPartIndex < partThresholds.length && progress >= partThresholds[currentPartIndex]) {
        setAnalysisStatus(`Analizando tu ${faceParts[currentPartIndex]}...`);
        currentPartIndex++;
      }

      if (currentPos <= 0) {
        clearInterval(interval);
        setIsAnalysisComplete(true);
      }
    }, 20);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleBackFromCamera = () => {
    stopCamera();
    setCurrentScreen('selection');
  };

  const handleBackFromAnalysis = () => {
    setIsAnalysisComplete(false);
    setCapturedImage(null);
    setCurrentScreen('selection');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#333] font-sen overflow-hidden">
      
      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg z-[60] flex items-center gap-3 max-w-[90%] animate-fade-in-down">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FF0000" fillOpacity="0.1" stroke="#FF0000" strokeWidth="2"/><path d="M12 8V12M12 16H12.01" stroke="#FF0000" strokeWidth="2" strokeLinecap="round"/></svg>
           <p className="text-sm font-bold text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className={`w-full h-screen flex flex-col ${currentScreen === 'selection' ? 'max-w-[500px] mx-auto' : ''}`}>
        
        {/* --- SELECTION SCREEN --- */}
        {currentScreen === 'selection' && (
          <div className="flex flex-col h-full w-full px-5">
            {/* Header - Fixo no topo */}
            <header className="flex-shrink-0 w-full mb-4 pt-4 flex justify-between items-center">
                 <button onClick={onBack} className="text-2xl p-2 -ml-2 hover:opacity-75 active:scale-95 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300" aria-label="Voltar">
                    &lt;
                </button>
                 <img 
                    src="/assets/logo-dressfy.webp" 
                    alt="Dressfy Logo"
                    className="h-5"
                />
                <div className="w-8"></div>
            </header>

            {/* Conteúdo principal - Scrollável */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Title */}
              <h1 className="text-[#1C1C1E] font-sen font-bold text-[22px] sm:text-[26px] leading-tight mb-6 text-center">
                Toma una selfie como se indica a continuación
              </h1>

              {/* Infographic */}
              <div className="flex justify-center mb-6">
                <img 
                  src="/assets/how-scan.webp" 
                  alt="Instrucciones de selfie" 
                  className="w-full max-w-[320px] h-auto rounded-2xl shadow-sm"
                />
              </div>
            </div>
            
            {/* Botões - Fixos no bottom */}
            <div className="flex-shrink-0 w-full flex flex-col gap-3 pb-4">
              <button 
                onClick={initCamera}
                className="w-full py-4 px-6 bg-black text-white font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-gray-900 active:scale-98 transition-all duration-200 rounded-sm focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                TOMAR UNA SELFIE
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-6 bg-white text-black font-bold uppercase tracking-widest text-sm border border-black hover:bg-gray-50 active:scale-98 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                CARGAR DESDE LA GALERÍA
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />

              {/* Privacy - Dentro da área fixa */}
              <div className="flex items-start gap-2 px-1 w-full text-left mt-2">
                  <span role="img" aria-label="lock" className="text-sm mt-0.5 flex-shrink-0">🔒</span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                     Tu privacidad es nuestra prioridad. Permanecerás anónimo/a: nadie verá tu rostro cuando lo escanees.
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* --- CAMERA SCREEN (Full Screen Overlay) --- */}
        {currentScreen === 'camera' && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            {/* Back Button */}
            <button 
                onClick={handleBackFromCamera} 
                className="absolute top-6 left-6 z-20 bg-black/30 p-2 rounded-full backdrop-blur-md"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18L9 12L15 6"/></svg>
            </button>

            {/* Video Feed */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            ></video>
            
            {/* Oval Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[400px] aspect-[3/4] border-[3px] border-dashed border-white/90 rounded-[50%] pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
            
            {/* Instructions */}
            <div className="absolute bottom-[140px] left-0 right-0 text-center z-20 pointer-events-none">
              <p className="text-white font-bold text-lg drop-shadow-md">Centra tu rostro en el óvalo</p>
            </div>

            {/* Capture Button */}
            <button 
              onClick={capturePhoto}
              className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 w-[80px] h-[80px] rounded-full border-[4px] border-white/40 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-30 bg-transparent"
            >
              <div className="w-[64px] h-[64px] rounded-full bg-white shadow-lg"></div>
            </button>
          </div>
        )}

        {/* --- ANALYSIS SCREEN --- */}
        {currentScreen === 'analysis' && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            {!isAnalysisComplete && (
                <button 
                    onClick={handleBackFromAnalysis} 
                    className="absolute top-6 left-6 z-20 bg-black/30 p-2 rounded-full backdrop-blur-md"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18L9 12L15 6"/></svg>
                </button>
            )}

            <div className="relative w-full h-full">
              <canvas 
                ref={canvasRef}
                className={`w-full h-full object-cover transition-all duration-700 ${isAnalysisComplete ? 'blur-[8px] opacity-50' : 'blur-0 opacity-100'}`}
              ></canvas>
              
              {!isAnalysisComplete && (
                <div 
                    className="absolute left-0 w-full h-[4px] bg-[#4CAF50] shadow-[0_0_15px_rgba(76,175,80,0.9)] transition-all ease-linear z-10"
                    style={{ bottom: `${scanPosition}%` }}
                ></div>
              )}

              {!isAnalysisComplete && (
                <div className="absolute bottom-[100px] left-0 right-0 text-center z-20">
                   <p className="text-white font-bold text-xl drop-shadow-md bg-black/40 inline-block px-4 py-2 rounded-full backdrop-blur-sm">{analysisStatus}</p>
                </div>
              )}

              {isAnalysisComplete && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center z-30 p-6 animate-fade-in">
                   <p className="text-2xl font-semibold mb-8 drop-shadow-lg max-w-xs leading-relaxed">Análisis completo, haz clic en el botón a continuación para continuar</p>
                   <div className="text-5xl animate-bounce mb-12">↓</div>
                   
                   <button 
                        onClick={onContinue}
                        className="w-full max-w-sm bg-white text-black py-4 px-6 rounded-full text-lg font-sen font-bold shadow-xl hover:bg-gray-100 transform hover:scale-105 transition-all uppercase tracking-wide"
                     >
                        VER RESULTADOS
                     </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CameraAnalysisPage;