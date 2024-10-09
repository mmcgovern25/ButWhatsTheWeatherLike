'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [spinEnabled, setSpinEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.mapboxgl) {
      console.error('Mapbox GL JS is not loaded');
      return;
    }

    if (map.current) return; // Initialize map only once

    window.mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG1jZ292ZXJuMjUiLCJhIjoiY2xtOWpkZWZoMGxvZzNwcGM1Yzlmd2k3diJ9.9EkXzkecaVXwJHGJqIShpQ';

    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.5,
      center: [-90, 40]
    });

    map.current.on('style.load', () => {
      map.current.setFog({});
    });

    const secondsPerRevolution = 120;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;

    function spinGlobe() {
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond / 60;
        map.current.setCenter(center);
        requestAnimationFrame(spinGlobe);
      }
    }

    map.current.on('mousedown', () => {
      userInteracting = true;
    });

    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('dragend', () => {
      userInteracting = false;
      spinGlobe();
    });

    spinGlobe();

    return () => map.current.remove();
  }, [spinEnabled]);

  const toggleSpin = () => {
    setSpinEnabled(!spinEnabled);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Your existing background content */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Image
          src="/images/background.svg"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Title */}
      <h1 style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 2,
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        But What's The Weather Like?
      </h1>

      {/* Globe and button */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        <button
          onClick={toggleSpin}
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            padding: '10px 20px',
            backgroundColor: '#3386c0',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {spinEnabled ? 'Pause rotation' : 'Start rotation'}
        </button>
      </div>
    </div>
  );
}