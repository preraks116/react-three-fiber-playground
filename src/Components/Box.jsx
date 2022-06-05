import { useBox } from "@react-three/cannon"
import React, { useEffect, useRef } from "react";
import usePersonControls from "../utils/Controls";
import getTexture from "../utils/Textures";
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useState } from "react";


const BOX_SIZE = 2
const GRID_SIZE = 20
const ORIGIN_COORDS = [0, 0, 0]

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
        <boxBufferGeometry attach="geometry" args={props.dimension} />
        <meshStandardMaterial {...props2} />
      </mesh>
    )
} 

const MyCube = (props) => {
  const box = useRef()
  const [color, setColor] = useState('gray')
  let timeout

  // Limit to max positions
  const maxPos = GRID_SIZE - BOX_SIZE
  // Add position of map to box
  var pos = ORIGIN_COORDS.map(function (num, i) {
      return (num > maxPos ? maxPos : num) + (props.position !== undefined && props.position[i])
  })

  const [mesh] = useBox(() => ({
      mass: 1,
      args: [2, 2, 2],
      position: [pos[0] - (GRID_SIZE - BOX_SIZE) / 2, pos[1], pos[2] - (GRID_SIZE - BOX_SIZE) / 2],
      onCollide: () => {
          setColor('red')
          clearTimeout(timeout)
          timeout = setTimeout(() => {
              setColor('gray')
          }, 1000)
      }
  }))

  return (
      <mesh castShadow ref={mesh}>
          <boxBufferGeometry ref={box} args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
          <meshStandardMaterial attach="material" color={color} />
      </mesh>
  )
}

export default Box;
export { MyCube };