import { Physics } from "@react-three/cannon"
import { Canvas } from "@react-three/fiber";
import { CameraController } from '../utils/Camera';
import getTexture from '../utils/Textures';
import Box from '../Components/Box';
import Plane from '../Components/Plane';

export default function Playground() {
    return (
        <Canvas
        camera={{ position: [0, 5, 20], fov: 90 }}
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
                    dimension={[0.1, 5, 10]}
                    position={[5, 2.5, 0]}
                    type="Static"
                    textures={getTexture("Wood")}
                />

                <Box
                    dimension={[15, 15, 0.5]}
                    position={[0, 0.25, -25]}
                    type="Static"
                    textures={getTexture("Wood")}
                />

                <Box 
                    dimension={[1, 1, 1]} 
                    position={[0, 1.5, 0]} 
                    type="person"
                />

            </Physics>
        </Canvas>
    )
};