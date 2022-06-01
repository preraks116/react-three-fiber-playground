import './App.css'
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon"
import { useTexture } from "@react-three/drei"
import * as THREE from 'three';

const getTexture = (key) => {
  // dict of dicts
  const textures = {
    "TactilePaving": {
      map: 'src/textures/tile/TactilePaving003_1K_Color.jpg',
      normalMap: 'src/textures/tile/TactilePaving003_1K_NormalDX.jpg',
      roughnessMap: 'src/textures/tile/TactilePaving003_1K_Roughness.jpg',
    },
    "Asphalt": {
      map: 'src/textures/road/Asphalt015_2K_Color.jpg',
      normalMap: 'src/textures/road/Asphalt015_2K_NormalDX.jpg',
      roughnessMap: 'src/textures/road/Asphalt015_2K_Roughness.jpg',
    },
    "Wood": {
      map: 'src/textures/wood/WoodFloor041_1K_Color.jpg',
      normalMap: 'src/textures/wood/WoodFloor041_1K_NormalDX.jpg',
      roughnessMap: 'src/textures/wood/WoodFloor041_1K_Roughness.jpg',
      aoMap: 'src/textures/wood/WoodFloor041_1K_AmbientOcclusion.jpg',
    },
    "ChristmasOrnament": {
      map: 'src/textures/ball/ChristmasTreeOrnament002_1K_Color.jpg',
      normalMap: 'src/textures/ball/ChristmasTreeOrnament002_1K_NormalDX.jpg',
      roughnessMap: 'src/textures/ball/ChristmasTreeOrnament002_1K_Roughness.jpg',
    }
  }
  return textures[key];
}

const usePersonControls = () => {
  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump',
    KeyR: 'reset'
  }

  const moveFieldByKey = (key) => keys[key]

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    reset: false
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
    mass: props.mass ? props.mass : 1, 
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
  const def = getTexture("TactilePaving");
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

function Sphere(props) {
  const mesh = useSphere(() => ({  
    mass: props.mass, 
    position: props.position, 
    args: props.dimension, 
    type: props.type
  }))
  const [ref, api] = mesh;
  const controls = usePersonControls();
  const position = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);
  const speed = 0.05; 
  const throwSpeed = 15;
  const textures = props.textures;
  const def = getTexture("TactilePaving");
  const props2 = textures ? useTexture(textures) : useTexture(def);

  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v))
    const unsubscribe2 = api.velocity.subscribe((v) => (velocity.current = v))
    return [unsubscribe, unsubscribe2]
  }, [])

  // console.log(velocity.current)

  useFrame(() => {
    // key controls
    // todo: calculating forward vector
    if(props.type == "person") {
      if (controls.left) {
        // api.velocity.set(-1, 0, 0);
        api.position.set(position.current[0] - speed, position.current[1], position.current[2]);
      }
      if (controls.right) {
        // api.velocity.set(1, 0, 0);
        api.position.set(position.current[0] + speed, position.current[1], position.current[2]);
      }
      if(controls.jump)
      {
        api.velocity.set(0, 0, -1*throwSpeed);
      }
      if(controls.reset)
      {
        // api.velocity.set(0, 0, 0);
        api.position.set(props.position[0], props.position[1], props.position[2]);
      }
    }
  });

  return (
   <mesh {...props} ref={ref}>
    <sphereBufferGeometry args={props.dimension} attach="geometry" />
    <meshStandardMaterial {...props2} />
   </mesh>
  );
 }

function Plane(props) {
  const [ref] = usePlane(() => ({ position: props.position, rotation: props.rotation, dimensions: props.dimension }))
  const textures = props.textures;
  const def = getTexture("TactilePaving")
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
