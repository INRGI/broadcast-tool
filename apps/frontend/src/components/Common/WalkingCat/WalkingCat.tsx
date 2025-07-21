import React, { useEffect, useState } from 'react';

const WalkingCat = () => {
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [meow, setMeow] = useState(false);

  useEffect(() => {
    if (meow) {
      const timeout = setTimeout(() => setMeow(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [meow]);

  return (
    <>
      <div
        onClick={() => setMeow(true)}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 100,
          animation: `${direction === 'right' ? 'walk-right' : 'walk-left'} 10s linear infinite`,
          cursor: 'pointer',
        }}
        onAnimationIteration={() =>
          setDirection((prev) => (prev === 'right' ? 'left' : 'right'))
        }
      >
        <img
          src="/kot.gif"
          alt="Walking Cat"
          style={{
            width: 50,
            transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        />
        {meow && (
          <div
            style={{
              position: 'absolute',
              top: -30,
              left: 20,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '8px',
              width: 'max-content',
              fontSize: '14px',
              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            }}
          >
            За клік бонус не дадуть
          </div>
        )}
      </div>

      <style>{`
        @keyframes walk-right {
          0% { left: 0; }
          100% { left: 100%; }
        }
        @keyframes walk-left {
          0% { left: 100%; }
          100% { left: 0%; }
        }
      `}</style>
    </>
  );
};

export default WalkingCat;
