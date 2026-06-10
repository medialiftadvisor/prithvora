'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CanvasInner = dynamic(() => import('./EarthFarmlandCanvasInner'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-spruce flex items-center justify-center text-white z-0">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-league font-bold text-xs tracking-widest text-accent uppercase">
          Initializing Agriverse 3D...
        </p>
      </div>
    </div>
  ),
});

export default function EarthFarmlandCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <CanvasInner />
    </div>
  );
}
