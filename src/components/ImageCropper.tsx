
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, X } from 'lucide-react';

interface ImageCropperProps {
  image: File;
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCrop, onCancel }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(image);
  }, [image]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Center the crop area when image loads
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cropSize = 200;
      setCrop({
        x: (rect.width - cropSize) / 2,
        y: (rect.height - cropSize) / 2,
      });
    }
    console.log('Image loaded successfully');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({ 
        x: e.clientX - rect.left - crop.x, 
        y: e.clientY - rect.top - crop.y 
      });
    }
    console.log('Started dragging');
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    const cropSize = 200;
    const maxX = rect.width - cropSize;
    const maxY = rect.height - cropSize;

    setCrop({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    console.log('Stopped dragging');
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getCroppedImage = async () => {
    console.log('Starting crop process...');
    
    if (!imageRef.current || !canvasRef.current || !containerRef.current || !imageLoaded) {
      console.error('Missing required elements or image not loaded');
      return;
    }

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cropSize = 200;
    
    // Get the actual displayed image dimensions
    const imgRect = img.getBoundingClientRect();
    const containerX = containerRect.left;
    const containerY = containerRect.top;
    const imgX = imgRect.left - containerX;
    const imgY = imgRect.top - containerY;
    
    // Calculate scale factors between natural and displayed image
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    // Calculate crop area in natural image coordinates - using the exact crop area without modification
    const cropXInImg = Math.max(0, (crop.x - imgX) * scaleX);
    const cropYInImg = Math.max(0, (crop.y - imgY) * scaleY);
    const cropSizeXInImg = Math.min(cropSize * scaleX, img.naturalWidth - cropXInImg);
    const cropSizeYInImg = Math.min(cropSize * scaleY, img.naturalHeight - cropYInImg);

    console.log('Crop parameters:', {
      natural: { width: img.naturalWidth, height: img.naturalHeight },
      displayed: { width: imgRect.width, height: imgRect.height },
      crop: { x: cropXInImg, y: cropYInImg, sizeX: cropSizeXInImg, sizeY: cropSizeYInImg },
      scale: { x: scaleX, y: scaleY },
      zoom: scale
    });

    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputSize, outputSize);
    
    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the cropped image - use the rectangular crop area directly without forcing square
    // This preserves the user's intended crop area better
    ctx.drawImage(
      img,
      cropXInImg,
      cropYInImg,
      cropSizeXInImg,
      cropSizeYInImg,
      0,
      0,
      outputSize,
      outputSize
    );

    ctx.restore();

    // Convert to blob with high quality
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('Successfully created cropped circular image blob');
        onCrop(blob);
      } else {
        console.error('Failed to create blob from canvas');
      }
    }, 'image/png', 1.0);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden select-none border"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {imageSrc && (
              <>
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  className="w-full h-full object-contain"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }}
                  draggable={false}
                  onLoad={handleImageLoad}
                  onError={() => console.error('Image failed to load')}
                />
                {imageLoaded && (
                  <>
                    {/* Dark overlay with circular cutout */}
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"
                      style={{
                        clipPath: `circle(100px at ${crop.x + 100}px ${crop.y + 100}px)`,
                      }}
                    />
                    {/* Crop circle border */}
                    <div
                      className="absolute border-4 border-white rounded-full pointer-events-none shadow-lg"
                      style={{
                        width: '200px',
                        height: '200px',
                        left: `${crop.x}px`,
                        top: `${crop.y}px`,
                        boxShadow: 'inset 0 0 0 2px rgba(59, 130, 246, 0.8), 0 0 20px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                    {/* Draggable area */}
                    <div
                      className="absolute cursor-move"
                      style={{
                        width: '200px',
                        height: '200px',
                        left: `${crop.x}px`,
                        top: `${crop.y}px`,
                      }}
                      onMouseDown={handleMouseDown}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Zoom:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={getCroppedImage} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!imageLoaded}
            >
              <Crop className="w-4 h-4 mr-2" />
              Crop & Save
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
