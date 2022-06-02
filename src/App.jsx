import './App.css'
import { Canvas } from "@react-three/fiber";
import { CameraController } from './utils/Camera';
import BowlingAlley from './Scenes/BowlingAlley';
import Playground from './Scenes/Playground';

function App() {
  return (
    <>
    <Canvas
      camera={{ position: [0,5,20], fov: 90 }} 
    >
      <CameraController />
      <ambientLight />
      <spotLight intensity={0.3} position={[5, 10, 50]} />
      <directionalLight
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <BowlingAlley />
      {/* <Playground /> */}
    </Canvas>
    </>
  );
}

export default App
