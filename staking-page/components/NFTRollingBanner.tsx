'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const NFT_IMAGES = [
  '/nft-rolling-banner/1.avif',
  '/nft-rolling-banner/2.avif',
  '/nft-rolling-banner/3.avif',
  '/nft-rolling-banner/4.avif',
  '/nft-rolling-banner/5.avif',
];

export function NFTRollingBanner() {
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  useEffect(() => {
    // Stagger the image loading for animation effect
    NFT_IMAGES.forEach((_, index) => {
      setTimeout(() => {
        setLoadedImages(prev => [...prev, index]);
      }, index * 200); // 200ms delay between each image
    });
  }, []);

  return (
    <div className="w-full overflow-hidden py-8" style={{
      background: 'linear-gradient(180deg, rgba(20, 13, 6, 0) 0%, #140D06 100%)'
    }}>
      <div className="relative">
        {/* Scrolling container */}
        <div className="flex gap-6 animate-scroll">
          {/* First set of images */}
          {NFT_IMAGES.map((src, index) => (
            <div
              key={`img-1-${index}`}
              className="flex-shrink-0 transition-all duration-700 ease-out"
              style={{
                opacity: loadedImages.includes(index) ? 1 : 0,
                transform: loadedImages.includes(index)
                  ? 'translateY(0)'
                  : 'translateY(40px)',
              }}
            >
              <div
                className="rounded-xl overflow-hidden border-2"
                style={{
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  width: '200px',
                  height: '200px',
                  position: 'relative'
                }}
              >
                <Image
                  src={src}
                  alt={`NFT ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {NFT_IMAGES.map((src, index) => (
            <div
              key={`img-2-${index}`}
              className="flex-shrink-0 transition-all duration-700 ease-out"
              style={{
                opacity: loadedImages.includes(index) ? 1 : 0,
                transform: loadedImages.includes(index)
                  ? 'translateY(0)'
                  : 'translateY(40px)',
              }}
            >
              <div
                className="rounded-xl overflow-hidden border-2"
                style={{
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  width: '200px',
                  height: '200px',
                  position: 'relative'
                }}
              >
                <Image
                  src={src}
                  alt={`NFT ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * 5 - 24px * 5));
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
