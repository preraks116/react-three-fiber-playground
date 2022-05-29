// import { useState } from 'react'
// import logo from './logo.svg'
import './App.css'
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Physics, useBox, usePlane } from "@react-three/cannon"
import * as THREE from "three";

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
  const mesh = useBox(() => ({ mass: 1, ...props }))
  const [ref, api] = mesh;
  const controls = usePersonControls();
  const position = useRef([0, 0, 0]);
  const speed = 0.05;
  // gets current position of the object 
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v))
    return unsubscribe
  }, [])

  useFrame(() => {
    // add key controls
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
  });
  
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshPhongMaterial attach="material" color="hotpink"/>
    </mesh>
  )
} 

function Plane(props) {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <group>
        <mesh {...props} ref={ref} >
          <planeBufferGeometry attach='geometry' args={props.dimension} />
          <meshStandardMaterial attach='material' color={props.color} side={THREE.DoubleSide} />
          {/* <shadowMaterial attach='material' /> */}
        </mesh>
    </group>
  )
}

function App() {
  return (
    <>
    <Canvas
      camera={{ position: [0,9,20], fov: 50 }} 
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
        dimension={[10, 10]}  
        color={"yellow"} 
        />

        <Plane
          rotation={[0, -Math.PI / 2, 0]} 
          position={[5, 2, 0]} 
          dimension={[10, 4]}  
          color={"orange"} 
        />

        <Plane
          rotation={[0, Math.PI / 2, 0]} 
          position={[-5, 2, 0]} 
          dimension={[10, 4]}  
          color={"orange"} 
        />

        <Plane
          rotation={[0, 0, Math.PI / 2]} 
          position={[0, 2, -5]} 
          dimension={[4, 10]}  
          color={"orange"} 
        />

        <Box 
          // dimension={[1, 2, 1]} 
          position={[0, 0.5, 0]} 
          // color="hotpink" 
        />
      </Physics>
    </Canvas>
    </>
  );
}

export default App
