const NFT_IMAGES = [
  '/nft-rolling-banner/1.avif',
  '/nft-rolling-banner/2.avif',
  '/nft-rolling-banner/3.avif',
  '/nft-rolling-banner/4.avif',
  '/nft-rolling-banner/5.avif',
  '/nft-rolling-banner/6.avif',
  '/nft-rolling-banner/7.avif',
];

export function NFTRollingBanner() {

  const ScrollRow = ({ reverse = false }: { reverse?: boolean }) => (
    <div className={reverse ? "animate-scroll-reverse" : "animate-scroll"} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {/* First set */}
      {NFT_IMAGES.map((src, index) => (
        <div
          key={`img-1-${index}`}
          style={{
            flexShrink: 0,
          }}
        >
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '3px solid #5A4530',
            width: '140px',
            height: '160px',
            background: '#31220c',
          }}>
            <img
              src={src}
              alt={`NFT ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          }}
        >
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '3px solid #5A4530',
            width: '140px',
            height: '160px',
            background: '#31220c',
          }}>
            <img
              src={src}
              alt={`NFT ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      ))}
      {/* Third set for extra smoothness */}
      {NFT_IMAGES.map((src, index) => (
        <div
          key={`img-3-${index}`}
          style={{
            flexShrink: 0,
          }}
        >
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '3px solid #5A4530',
            width: '140px',
            height: '160px',
            background: '#31220c',
          }}>
            <img
              src={src}
              alt={`NFT ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      paddingTop: 'calc(18vh + 2rem)',
      paddingBottom: '1rem',
      background: 'linear-gradient(180deg, rgba(59, 39, 18, 0) 0%, #3B2712 100%)',
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-151px * 7)); }
          }
          @keyframes scroll-reverse {
            0% { transform: translateX(calc(-151px * 7)); }
            100% { transform: translateX(0); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll-reverse {
            animation: scroll-reverse 30s linear infinite;
          }
        `}</style>
        <ScrollRow />
        <ScrollRow reverse={true} />
      </div>
    </div>
  );
}
