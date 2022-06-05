import React, { useRef, useEffect, useState, Suspense, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, OrbitControls, Stars } from "@react-three/drei"
import { Physics, useBox, usePlane } from '@react-three/cannon'
import usePersonControls from "../utils/Controls";
import Box from '../Components/Box'
import * as THREE from 'three'
import { MyCube } from '../Components/Box';
import { Map } from '../Components/Plane';

const BOX_SIZE = 2  
const GRID_SIZE = 20

const Controls = (props) => {
    return <OrbitControls {...props} />
}

function CustomCamera(props) {
    const cameraRef = useRef()
    const set = useThree(({ set }) => set)
    const size = useThree(({ size }) => size)
    const aspect = size.width > size.height ? size.height / size.width : size.width / size.height
    const [zoom, setZoom] = useState(aspect * 50)

    useLayoutEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.aspect = size.width / size.height
            cameraRef.current.updateProjectionMatrix()
        }
    }, [size, props])

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
}

export default function Isometric() {
    return (
        <Canvas resize={{ scroll: false }} >
            <Suspense fallback={null}>
                <CustomCamera />
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
                            <Box
                                dimension={[BOX_SIZE, BOX_SIZE, BOX_SIZE]}
                                position={[0, 1, 0]}
                                type="person"
                            />
                            <MyCube position={[0, 5, 0]} />
                            <MyCube position={[5, 10, 4]} />
                        </group>
                    </Map>
                </Physics>
            </Suspense>
            <Stars />
        </Canvas>
    )
}
