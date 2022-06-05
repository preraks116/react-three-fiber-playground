import { usePlane } from "@react-three/cannon"
import getTexture from "../utils/Textures";
import { useTexture } from "@react-three/drei"
import { DoubleSide } from 'three';
import * as React from "react";

const GRID_SIZE = 20

export default function Plane(props) {
    const [ref] = usePlane(() => ({ position: props.position, rotation: props.rotation, dimensions: props.dimension }))
    const textures = props.textures;
    const def = getTexture("TactilePaving")
    const props2 = textures ? useTexture(textures) : useTexture(def);
  
    return (
      <group>
          <mesh {...props} ref={ref} >
            <planeBufferGeometry attach='geometry' args={props.dimension} />
            {/* <meshStandardMaterial attach='material' color={props.color} side={THREE.DoubleSide} /> */}
            <meshStandardMaterial {...props2} side={DoubleSide} />
          </mesh>
      </group>
    )
}

const Map = (props) => {
  const [mesh] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, -Math.PI / 2] }))

  const childrenWithProps = React.Children.map(props.children, (child) => {
      // checking isValidElement is the safe way and avoids a typescript error too
      if (React.isValidElement(child)) {
          return React.cloneElement(child, { position: props.position })
      }
      return child
  })

  return (
      <group>
          <gridHelper position={props.position} args={[GRID_SIZE, GRID_SIZE]} />
          {/* <mesh castShadow ref={box}>
              <boxBufferGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
              <meshStandardMaterial attach="material" color="gray" />
          </mesh> */}
          <mesh receiveShadow ref={mesh} {...props}>
              <planeBufferGeometry attach="geometry" args={[GRID_SIZE, GRID_SIZE]} />
              <meshStandardMaterial attach="material" color="gray" />
          </mesh>

          {childrenWithProps}
      </group>
  )
}

export { Map };