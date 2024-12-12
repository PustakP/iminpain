import React, { useState, useRef, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Upload } from 'lucide-react';

const ImageInpaintingWidget = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [exportedImages, setExportedImages] = useState(null);
  const [brushRadius, setBrushRadius] = useState(10);
  const [imageSize, setImageSize] = useState({ width: 500, height: 400 });
  const canvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const originalCanvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Maintain aspect ratio while fitting within 500x400
          const aspectRatio = img.width / img.height;
          let newWidth = 500;
          let newHeight = 400;

          if (img.width > img.height) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }

          setImageSize({ width: newWidth, height: newHeight });
          setOriginalImage(String(e.target.result));
          setExportedImages(null);
        };
        img.src = String(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportMask = () => {
    if (canvasRef.current && hiddenCanvasRef.current && originalCanvasRef.current) {
      // Create original image canvas
      const originalCanvas = originalCanvasRef.current;
      const origCtx = originalCanvas.getContext('2d');
      
      // Create mask canvas
      const maskCanvas = hiddenCanvasRef.current;
      const maskCtx = maskCanvas.getContext('2d');
      
      if (origCtx && maskCtx) {
        // Draw original image
        const originalImg = new Image();
        originalImg.onload = () => {
          // Set canvas sizes
          originalCanvas.width = imageSize.width;
          originalCanvas.height = imageSize.height;
          maskCanvas.width = imageSize.width;
          maskCanvas.height = imageSize.height;

          // Draw original image
          origCtx.drawImage(originalImg, 0, 0, imageSize.width, imageSize.height);

          // init black bg
          maskCtx.fillStyle = 'black';
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
          
          // get drawing canvas
          const drawingCanvas = canvasRef.current.canvas.drawing;
          
          // use white for mask areas instead of transparency
          maskCtx.globalCompositeOperation = 'source-over';
          maskCtx.fillStyle = 'white';
          maskCtx.drawImage(drawingCanvas, 0, 0);

          // export as urls
          const originalDataUrl = originalCanvas.toDataURL('image/png');
          const maskDataUrl = maskCanvas.toDataURL('image/png');
          
          setExportedImages({ 
            original: originalDataUrl, 
            mask: maskDataUrl 
          });
        };
        originalImg.src = originalImage;
      }
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setExportedImages(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Image Inpainting Widget</h1>
      
      {!originalImage ? (
        <div className="w-full mb-4">
          <label 
            className="relative flex flex-col items-center justify-center w-full h-64 
                       border-2 border-dashed border-blue-400 rounded-lg 
                       bg-blue-50 hover:bg-blue-100 cursor-pointer 
                       transition-colors duration-200"
          >
            <input 
              type="file" 
              accept="image/jpeg,image/png" 
              onChange={handleImageUpload}
              className="hidden "
              style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
            />
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-3 text-blue-500" />
              <p className="mb-2 text-lg text-blue-600 font-semibold">
                Click or drag and drop
              </p>
              <p className="text-sm text-blue-500">
                PNG or JPG (max. 800x400px)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center mb-4 w-full">
            <label className="mr-2">Brush Size:</label>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={brushRadius}
              onChange={(e) => setBrushRadius(Number(e.target.value))}
              className="w-40"
            />
            <span className="ml-2">{brushRadius}</span>
          </div>

          <div className="flex justify-center w-full">
            <CanvasDraw
              ref={canvasRef}
              brushRadius={brushRadius}
              brushColor="white"
              canvasWidth={imageSize.width}
              canvasHeight={imageSize.height}
              imgSrc={originalImage}
              backgroundColor="black"
              className="border-2 border-gray-300"
            />
          </div>

          <canvas
            ref={originalCanvasRef}
            style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
          />
          <canvas
            ref={hiddenCanvasRef}
            style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
          />

          <div className="mt-4 space-x-4 flex justify-center">
            <button 
              onClick={handleExportMask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export Mask
            </button>
            <button 
              onClick={handleClearCanvas}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      )}

      {exportedImages && (
        <div className="flex flex-col items-center mt-8 w-full">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Original Image</h2>
              <img 
                src={exportedImages.original} 
                alt="Original" 
                className="max-w-[500px] max-h-[400px] border-2 border-gray-300"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Mask Image</h2>
              <img 
                src={exportedImages.mask} 
                alt="Mask" 
                className="max-w-[500px] max-h-[400px] border-2 border-gray-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInpaintingWidget;