import './App.css'
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon"
import getTexture from './utils/Textures';
import { CameraController } from './utils/Camera';
import Box from './Components/Box';
import Sphere from './Components/Sphere';
import Plane from './Components/Plane';

function BowlingPins(props) {  
  const positions = [];
  const vertical = props.horizontal;
  const horizontal = props.vertical;

  const addPins = (x, y, z) => {
    positions.push([x, y, z]);
  }

  for (let i = 0; i < 4; i++) {
    let delZ = i*vertical;
    for( let j = 0, delX = -1*i*horizontal/2 ; j < i+1; j++, delX += horizontal) {
      addPins(props.position[0] + delX, props.position[1], props.position[2] - delZ);
    }
  }

  return (
    <group>
      {positions.map((position, index) => (
        <Box 
          mass={props.mass}
          key={index}
          position={position}
          dimension={props.dimension}
          textures={props.textures}
        />
      ))}
    </group>
  )
}

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

      <Physics>

        <Plane
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        dimension={[50, 50]}  
        textures={getTexture("Asphalt")}
        />

        <Box 
          dimension={[15, 0.5, 50]} 
          position={[0, 0.25, 0]} 
          type="Static"
          textures={getTexture("Wood")}
        />

        <Box 
          dimension={[15, 15, 0.5]} 
          position={[0, 0.25, -25]} 
          type="Static"
          textures={getTexture("Wood")}
        />

        <Sphere
          mass={5}
          dimension={[1]}
          position={[0, 5.5, 12]}
          type="person"
          textures={getTexture("ChristmasOrnament")}
        />

        <BowlingPins
          mass={0.1}
          dimension={[0.5, 2.5, 0.5]} 
          position={[0, 2.5, -15]} 
          type="dynamic"
          horizontal={2}
          vertical={2}
        />

        {/* <Box 
          dimension={[1, 1, 1]} 
          position={[0, 1.5, 0]} 
          type="person"
        /> */}

      </Physics>
    </Canvas>
    </>
  );
}

export default App
