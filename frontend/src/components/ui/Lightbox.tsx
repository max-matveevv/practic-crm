'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    url: string;
    original_name: string;
  }>;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ isOpen, onClose, images, currentIndex, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Close button */}
      <Button
        variant="secondary"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 p-0 flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 p-0 flex items-center justify-center"
            disabled={currentIndex === 0}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          
          <Button
            variant="secondary"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 p-0 flex items-center justify-center"
            disabled={currentIndex === images.length - 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </>
      )}

      {/* Image container */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <Image
          src={currentImage.url}
          alt={currentImage.original_name}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Image name */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm max-w-xs truncate">
        {currentImage.original_name}
      </div>
    </div>
  );
}
