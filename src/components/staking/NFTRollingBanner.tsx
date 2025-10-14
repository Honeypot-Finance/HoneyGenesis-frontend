import { useEffect, useState } from 'react';

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
      }, index * 200);
    });
  }, []);

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      padding: '2rem 0',
      background: 'linear-gradient(180deg, rgba(20, 13, 6, 0) 0%, #140D06 100%)'
    }}>
      <div style={{ position: 'relative' }}>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-220px * 5)); }
          }
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
        `}</style>
        <div className="animate-scroll" style={{ display: 'flex', gap: '1.5rem' }}>
          {/* First set */}
          {NFT_IMAGES.map((src, index) => (
            <div
              key={`img-1-${index}`}
              style={{
                flexShrink: 0,
                opacity: loadedImages.includes(index) ? 1 : 0,
                transform: loadedImages.includes(index) ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.7s ease-out',
              }}
            >
              <div style={{
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                border: '2px solid rgba(247, 149, 29, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                width: '200px',
                height: '200px',
                background: '#31220c',
              }}>
                <img
                  src={src}
                  alt={`NFT ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {NFT_IMAGES.map((src, index) => (
            <div
              key={`img-2-${index}`}
              style={{
                flexShrink: 0,
                opacity: loadedImages.includes(index) ? 1 : 0,
                transform: loadedImages.includes(index) ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.7s ease-out',
              }}
            >
              <div style={{
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                border: '2px solid rgba(247, 149, 29, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                width: '200px',
                height: '200px',
                background: '#31220c',
              }}>
                <img
                  src={src}
                  alt={`NFT ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
