import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useBox } from "@react-three/cannon"
import { OrbitControls } from "@react-three/drei"
import { TextureLoader } from 'three'
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import usePersonControls from "../utils/Controls";
import { Physics } from '@react-three/cannon'
import { useThree } from "@react-three/fiber";
import Box from '../Components/Box'
import { Map } from '../Components/Plane';
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei"
import { Vector3 } from 'three'

const BOX_SIZE = 2  
const GRID_SIZE = 20
const ORIGIN_COORDS = [0, 0, 0]

const cameraVector = new Vector3(11.547005383792516, -11.547005383792513, -11.547005383792515);
// const cameraVector2 = new Vector3(0);
let objectCoord = new Vector3(0, 0, 0);

const Controls = (props) => {
    return <OrbitControls {...props} />
}

function OrthogCamera(props) {
    const cameraRef = useRef()
    const set = useThree(({ set }) => set)
    const size = useThree(({ size }) => size)
    const aspect = size.width > size.height ? size.height / size.width : size.width / size.height
    const [zoom, setZoom] = useState(aspect * 50)

    // const cameraPos = cameraRef.current.position
    // const x = cameraPos.multiplyScalar(-1);

    useLayoutEffect(() => {
        if (cameraRef.current) {
            // make a copy of the camera position
            console.log("hi");
            cameraVector.copy(cameraRef.current.position)   
            console.log(cameraVector)
            console.log(cameraRef.current.position)
            // cameraVector2.set(cameraRef.current.position.multiplyScalar(-1))
            // console.log(cameraVector2)
            cameraRef.current.aspect = size.width / size.height
            cameraRef.current.updateProjectionMatrix()
            
            let cameraPos = new Vector3(cameraRef.current.position)
            cameraPos.addVectors(objectCoord, cameraVector)
            // console.log(cameraPos)
            // set the camera position 
        }
    }, [size, props])

    useFrame(() => {
        let cameraPos = new Vector3(cameraRef.current.position)
        cameraPos.addVectors(objectCoord, cameraVector)
        // console.log(cameraPos)
    }
    , [])

    useLayoutEffect(() => {
        set({ camera: cameraRef.current })
    }, [])

    useEffect(() => {
        // void setDefaultCamera(camera.current)
        cameraRef.current.rotation.order = 'YXZ'
        cameraRef.current.translateZ(GRID_SIZE)

        window.addEventListener('wheel', (e) => {
            // Limit zoom dimensions
            if (e.deltaY < 0 && cameraRef.current.zoom <= aspect * 300) setZoom(cameraRef.current.zoom - (e.deltaY / 120) * 10)
            if (e.deltaY > 0 && cameraRef.current.zoom >= aspect * 50) setZoom(cameraRef.current.zoom - (e.deltaY / 120) * 10)
        })
    }, [cameraRef])

    return (
        <OrthographicCamera
            ref={cameraRef}
            zoom={zoom}
            near={0.1}
            far={500}
            rotation={[Math.atan(-1 / Math.sqrt(2)), -Math.PI / 4, 0]}
            onUpdate={(self) => self.updateProjectionMatrix()}
            {...props}
        />
    )
};

function Sprite(props) {

    const loader = new TextureLoader();

    const texture = loader.load(props.image);
    return (
        <sprite {...props}>
            <spriteMaterial map={texture} />
        </sprite>
    )
}
const Cube = (props) => {
    const box = useRef()
    const [color, setColor] = useState('gray')
    let timeout;
    const speed = 0.05; 
    const position = useRef([0, 0, 0]);
    const controls = usePersonControls();
    const { camera } = useThree();


    const [ mesh, api ] = useBox(() => ({
        mass: 1,
        args: [2, 2, 2],
        position: props.position,
        onCollide: () => {
            setColor('red')
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                setColor('gray')
            }, 1000)
        }
    }))

    useLayoutEffect(() => {
        const unsubscribe = api.position.subscribe((v) => (position.current = v))
        return unsubscribe
    })

    useFrame(() => {
        // key controls
        // todo: calculating forward vector
        // console.log(objectCoord)
        // todo: add error handling to make sure the box is always at the centre of the screen
        if(props.type == "person") {
            objectCoord = position.current
            if (controls.forward) {
            // api.velocity.set(0, 0, -1); 
            api.position.set(position.current[0], position.current[1], position.current[2] - speed);
            // update camera position
            camera.position.set(camera.position.x, camera.position.y, camera.position.z - speed);
            // camera.lookAt(position.current[0], position.current[1], position.current[2]);   
            }
            if (controls.backward) {
            // api.velocity.set(0, 0, 1);
            api.position.set(position.current[0], position.current[1], position.current[2] + speed);
            // update camera position
            camera.position.set(camera.position.x, camera.position.y, camera.position.z + speed);
            }
            if (controls.left) {
            // api.velocity.set(-1, 0, 0);
            api.position.set(position.current[0] - speed, position.current[1], position.current[2]);
            // update camera position
            camera.position.set(camera.position.x - speed, camera.position.y, camera.position.z);
            }
            if (controls.right) {
            // api.velocity.set(1, 0, 0);
            api.position.set(position.current[0] + speed, position.current[1], position.current[2]);
            // update camera position
            camera.position.set(camera.position.x + speed, camera.position.y, camera.position.z);
            }
        }
    });
  
    return (
        <mesh castShadow ref={mesh}>
            <boxBufferGeometry ref={box} args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
            <meshStandardMaterial attach="material" color={color} />
        </mesh>
    )
}

export default function Isometric() {
    return (
        <Canvas resize={{ scroll: false }} >
            <Suspense fallback={null}>
                <OrthogCamera />
                {/* <Controls enableDamping dampingFactor={0.2} /> */}
                <hemisphereLight intensity={0.1} />
                <directionalLight
                    castShadow
                    shadow-mapSize-height={144 * GRID_SIZE}
                    shadow-mapSize-width={144 * GRID_SIZE}
                    shadow-camera-top={-GRID_SIZE}
                    shadow-camera-right={GRID_SIZE}
                    shadow-camera-left={-GRID_SIZE}
                    shadow-camera-bottom={GRID_SIZE}
                    position={[10, 30, 10]}
                    color="yellow"
                    intensity={1.5}
                />
                <Physics>
                    <Map>
                        <group>
                            <Sprite 
                                position={[-5, 1, 5]} 
                                image="src/Sprites/tree2.jpg"
                            />
                            <Cube 
                                position={[0, 2, 0]} 
                                type="person"
                            />
                            <Cube position={[4, 5, 0]} />
                            <Cube position={[5, 10, 4]} />
                        </group>
                    </Map>
                </Physics>
            </Suspense>
        </Canvas>
    )
}
