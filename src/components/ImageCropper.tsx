
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    // Constrain the crop area within the container
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
    if (!imageRef.current || !canvasRef.current || !containerRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to the desired output size (circular)
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate the source rectangle based on the crop position and scale
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    
    // Calculate scale factors
    const scaleX = image.naturalWidth / imageRect.width;
    const scaleY = image.naturalHeight / imageRect.height;

    // Calculate crop area in image coordinates
    const cropSize = 200;
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceSize = cropSize * Math.max(scaleX, scaleY);

    // Create circular clip path
    ctx.save();
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the cropped image
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );

    ctx.restore();

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden select-none"
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
                />
                {/* Crop overlay */}
                <div
                  className="absolute border-4 border-white rounded-full shadow-lg pointer-events-none"
                  style={{
                    width: '200px',
                    height: '200px',
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  }}
                  onMouseDown={handleMouseDown}
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
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Zoom:</label>
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
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={getCroppedImage} className="bg-orange-500 hover:bg-orange-600">
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
