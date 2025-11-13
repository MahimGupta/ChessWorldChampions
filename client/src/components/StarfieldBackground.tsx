import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function StarfieldBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "attract",
              parallax: {
                enable: true,
                force: 10,
                smooth: 20,
              },
            },
          },
          modes: {
            attract: {
              distance: 200,
              duration: 0.4,
              speed: 1,
            },
          },
        },
        particles: {
          color: {
            value: ["#a855f7", "#3b82f6", "#06b6d4", "#8b5cf6"],
          },
          links: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "out",
            },
          },
          number: {
            value: 150,
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
          },
          opacity: {
            value: { min: 0.3, max: 1 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "star"],
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
