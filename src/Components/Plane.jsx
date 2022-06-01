import { usePlane } from "@react-three/cannon"
import getTexture from "../utils/Textures";
import { useTexture } from "@react-three/drei"
import { DoubleSide } from 'three';

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