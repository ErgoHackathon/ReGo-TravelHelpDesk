// ===========================================
// BACKGROUND PARTICLES COMPONENT
// ===========================================
// Subtle floating grid/dots in background
// ===========================================

import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const BackgroundParticles = ({ 
  variant = 'dots', // 'dots', 'grid', 'connections'
  opacity = 0.3,
  color = '#b91c1c'
}) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const configs = {
    dots: {
      particles: {
        number: { value: 50, density: { enable: true, area: 800 } },
        color: { value: color },
        shape: { type: "circle" },
        opacity: { value: opacity },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: true,
          straight: false,
          outModes: "bounce"
        }
      }
    },
    grid: {
      particles: {
        number: { value: 30, density: { enable: true, area: 600 } },
        color: { value: color },
        shape: { type: "circle" },
        opacity: { value: opacity * 0.5 },
        size: { value: 2 },
        links: {
          enable: true,
          distance: 150,
          color: color,
          opacity: opacity * 0.3,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.3,
          direction: "none",
          outModes: "bounce"
        }
      }
    },
    connections: {
      particles: {
        number: { value: 40 },
        color: { value: color },
        shape: { type: "circle" },
        opacity: { value: opacity },
        size: { value: 2 },
        links: {
          enable: true,
          distance: 200,
          color: color,
          opacity: opacity * 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none"
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          resize: true
        },
        modes: {
          grab: { distance: 140, links: { opacity: 0.5 } }
        }
      }
    }
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: false,
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        detectRetina: true,
        ...configs[variant]
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default BackgroundParticles;