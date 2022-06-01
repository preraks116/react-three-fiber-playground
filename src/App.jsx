import './App.css'
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Physics, useBox, usePlane } from "@react-three/cannon"
import { useTexture } from "@react-three/drei"
import * as THREE from 'three';

const usePersonControls = () => {
  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump',
  }

  const moveFieldByKey = (key) => keys[key]

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    }
    const handleKeyUp = (e) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  return movement
}

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);
      controls.minDistance = 3;
      controls.maxDistance = 20;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

function Box(props) {
  const mesh = useBox(() => ({ 
    mass: 1, 
    position: props.position, 
    args: props.dimension, 
    type: props.type
  }))
  const [ref, api] = mesh;
  const controls = usePersonControls();
  const position = useRef([0, 0, 0]);
  const speed = 0.05; 
  const textures = props.textures;
  // discuss with vasco 
  const def = ({
    map: 'src/textures/tile/TactilePaving003_1K_Color.jpg',
    normalMap: 'src/textures/tile/TactilePaving003_1K_NormalDX.jpg',
    roughnessMap: 'src/textures/tile/TactilePaving003_1K_Roughness.jpg',
  })
  const props2 = textures ? useTexture(textures) : useTexture(def);

  // gets current position of the object 
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v))
    return unsubscribe
  }, [])

  useFrame(() => {
    // key controls
    // todo: calculating forward vector
    if(props.type == "person") {
      if (controls.forward) {
        // api.velocity.set(0, 0, -1); 
        api.position.set(position.current[0], position.current[1], position.current[2] - speed);
      }
      if (controls.backward) {
        // api.velocity.set(0, 0, 1);
        api.position.set(position.current[0], position.current[1], position.current[2] + speed);
      }
      if (controls.left) {
        // api.velocity.set(-1, 0, 0);
        api.position.set(position.current[0] - speed, position.current[1], position.current[2]);
      }
      if (controls.right) {
        // api.velocity.set(1, 0, 0);
        api.position.set(position.current[0] + speed, position.current[1], position.current[2]);
      }
    }
  });
  
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry attach="geometry" args={props.dimension} />
      <meshStandardMaterial {...props2} />
    </mesh>
  )
} 

function Plane(props) {
  const [ref] = usePlane(() => ({ position: props.position, rotation: props.rotation, dimensions: props.dimension }))
  const textures = props.textures;
  const def = ({
    map: 'src/textures/tile/TactilePaving003_1K_Color.jpg',
    normalMap: 'src/textures/tile/TactilePaving003_1K_NormalDX.jpg',
    roughnessMap: 'src/textures/tile/TactilePaving003_1K_Roughness.jpg',
  })
  const props2 = textures ? useTexture(textures) : useTexture(def);

  return (
    <group>
        <mesh {...props} ref={ref} >
          <planeBufferGeometry attach='geometry' args={props.dimension} />
          {/* <meshStandardMaterial attach='material' color={props.color} side={THREE.DoubleSide} /> */}
          <meshStandardMaterial {...props2} side={THREE.DoubleSide} />
        </mesh>
    </group>
  )
}

function App() {
  return (
    <>
    <Canvas
      camera={{ position: [0,9,20], fov: 70 }} 
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
        textures={
          {
            map: 'src/textures/road/Asphalt015_2K_Color.jpg',
            normalMap: 'src/textures/road/Asphalt015_2K_NormalDX.jpg',
            roughnessMap: 'src/textures/road/Asphalt015_2K_Roughness.jpg',
          }
        }
        />

        <Box 
          dimension={[0.3, 5, 5]} 
          position={[5, 2.5, 0]} 
          color="orange"
          type="Static" 
          textures={
            {
              map: 'src/textures/brick/PavingStones092_1K_Color.jpg',
              normalMap: 'src/textures/brick/PavingStones092_1K_NormalDX.jpg',
              roughnessMap: 'src/textures/brick/PavingStones092_1K_Roughness.jpg',
              aoMap: 'src/textures/brick/PavingStones092_1K_AmbientOcclusion.jpg',
            }
          }
        />

        <Box 
          dimension={[5, 5, 0.3]} 
          position={[2.5, 2.5, -2.5]} 
          color="orange"
          type="Static" 
          textures={
            {
              map: 'src/textures/brick/PavingStones092_1K_Color.jpg',
              normalMap: 'src/textures/brick/PavingStones092_1K_NormalDX.jpg',
              roughnessMap: 'src/textures/brick/PavingStones092_1K_Roughness.jpg',
              aoMap: 'src/textures/brick/PavingStones092_1K_AmbientOcclusion.jpg',
            }
          }
        />

        <Box 
          dimension={[0.5, 0.5, 0.5]} 
          position={[10, 0.25, 0]} 
          type="Static"
          textures={
            {
              map: 'src/textures/wood/WoodFloor041_1K_Color.jpg',
              normalMap: 'src/textures/wood/WoodFloor041_1K_NormalDX.jpg',
              roughnessMap: 'src/textures/wood/WoodFloor041_1K_Roughness.jpg',
              aoMap: 'src/textures/wood/WoodFloor041_1K_AmbientOcclusion.jpg',
            }
          }
        />

        <Box 
          dimension={[1, 1, 1]} 
          position={[0, 1.5, 0]} 
          type="person"
        />

        <Box 
          dimension={[1, 2, 1]} 
          position={[-5, 1, 0]} 
          type="dynamic"
        />
      </Physics>
    </Canvas>
    </>
  );
}

export default App
