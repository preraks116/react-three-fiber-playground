import React, { useRef, useEffect } from "react";
import { useSphere } from "@react-three/cannon"
import usePersonControls from "../utils/Controls";
import getTexture from "../utils/Textures";
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";

export default function Sphere(props) {
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