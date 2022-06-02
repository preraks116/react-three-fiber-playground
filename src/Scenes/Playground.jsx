import { Physics } from "@react-three/cannon"
import getTexture from '../utils/Textures';
import Box from '../Components/Box';
import Plane from '../Components/Plane';

export default function Playground() {
    return (
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
    )
};