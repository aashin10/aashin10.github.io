import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import spacemanScene from "../assets/3d/spaceman.glb";
import CanvasLoader from "./Loader";

const Spaceman = ({ scale, position }) => {
  const spacemanRef = useRef();
  const { scene, animations } = useGLTF(spacemanScene);
  const { actions } = useAnimations(animations, spacemanRef);

  useEffect(() => {
    // Guarded: a re-exported/compressed model can rename or drop the clip, and an
    // unguarded actions["Idle"] takes the whole hero down with it.
    actions?.["Idle"]?.play();
  }, [actions]);

  return (
    <mesh ref={spacemanRef} position={position} scale={scale} rotation={[0, 2.2, 0]}>
      <primitive object={scene} />
    </mesh>
  );
};

const SpacemanCanvas = () => {
  const [scale, setScale] = useState([2, 2, 2]);
  const [position, setPosition] = useState([0.2, -0.7, 0]);

  // The canvas is stretched to the .parallax grid area (2000x1280), so it is far
  // larger than the viewport and keeps rendering long after the hero has scrolled
  // away. Gate the render loop on the hero actually being on screen.
  const containerRef = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([1, 1, 1]);
        setPosition([0.2, -0.1, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([1.33, 1.33, 1.33]);
        setPosition([0.2, -0.3, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([1.5, 1.5, 1.5]);
        setPosition([0.2, -0.4, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([1.66, 1.66, 1.66]);
        setPosition([0.2, -0.5, 0]);
      } else {
        setScale([2, 2, 2]);
        setPosition([0.2, -0.7, 0]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className='w-full h-full bg-transparent z-10'>
      <Canvas
        className='w-full h-full bg-transparent'
        camera={{ near: 0.1, far: 1000 }}
        // Uncapped, this renders at the full device pixel ratio of a 2000x1280 box
        // -- 4000x2560, over twice a fullscreen frame, half of it clipped away.
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={<CanvasLoader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight position={[0, 50, 10]} angle={0.15} penumbra={1} intensity={2} />
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

          <Spaceman scale={scale} position={position} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Kick the fetch off at module-eval so the hero's own asset wins the race against
// the below-fold images. Worth it now that the model is ~530KB rather than 2.9MB --
// at the old size this competed with first paint instead of helping it.
useGLTF.preload(spacemanScene);

export default SpacemanCanvas;
