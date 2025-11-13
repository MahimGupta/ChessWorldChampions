import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function LoadingVortex() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-32 h-32">
        <Particles
          id="vortex"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            particles: {
              color: {
                value: ["#a855f7", "#3b82f6"],
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                speed: 6,
                direction: "none",
                outModes: {
                  default: "destroy",
                },
                attract: {
                  enable: true,
                  rotate: {
                    x: 600,
                    y: 1200,
                  },
                },
              },
              number: {
                value: 50,
              },
              opacity: {
                value: { min: 0.3, max: 1 },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            emitters: {
              direction: "none",
              rate: {
                quantity: 5,
                delay: 0.1,
              },
              size: {
                width: 0,
                height: 0,
              },
              position: {
                x: 50,
                y: 50,
              },
            },
          }}
          className="absolute inset-0"
        />
      </div>
      <p className="mt-4 text-sm font-display text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
