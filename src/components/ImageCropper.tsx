
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

    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate the actual displayed image dimensions
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = containerRect.width / containerRect.height;
    
    let displayedWidth, displayedHeight, offsetX = 0, offsetY = 0;
    
    if (imgAspectRatio > containerAspectRatio) {
      displayedHeight = containerRect.height * scale;
      displayedWidth = displayedHeight * imgAspectRatio;
      offsetX = (containerRect.width - displayedWidth) / 2;
    } else {
      displayedWidth = containerRect.width * scale;
      displayedHeight = displayedWidth / imgAspectRatio;
      offsetY = (containerRect.height - displayedHeight) / 2;
    }

    const scaleX = img.naturalWidth / displayedWidth;
    const scaleY = img.naturalHeight / displayedHeight;

    const cropSize = 200;
    const naturalCropX = Math.max(0, (crop.x - offsetX) * scaleX);
    const naturalCropY = Math.max(0, (crop.y - offsetY) * scaleY);
    const naturalCropSize = Math.min(
      cropSize * Math.max(scaleX, scaleY),
      img.naturalWidth - naturalCropX,
      img.naturalHeight - naturalCropY
    );

    console.log('Crop dimensions:', { naturalCropX, naturalCropY, naturalCropSize });

    // Create circular clip path
    ctx.save();
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the cropped image
    ctx.drawImage(
      img,
      naturalCropX,
      naturalCropY,
      naturalCropSize,
      naturalCropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    ctx.restore();

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('Successfully created cropped image blob');
        onCrop(blob);
      } else {
        console.error('Failed to create blob from canvas');
      }
    }, 'image/jpeg', 0.9);
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
                    {/* Crop overlay */}
                    <div
                      className="absolute border-4 border-blue-500 rounded-full shadow-lg pointer-events-none"
                      style={{
                        width: '200px',
                        height: '200px',
                        left: `${crop.x}px`,
                        top: `${crop.y}px`,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
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
