import React, { useRef, useEffect, useState, Suspense, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, OrbitControls, Stars } from "@react-three/drei"
import { Physics, useBox, usePlane } from '@react-three/cannon'
import usePersonControls from "../utils/Controls";
import * as THREE from 'three'

const BOX_SIZE = 2
const GRID_SIZE = 20
const ORIGIN_COORDS = [0, 0, 0]

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

const MyMap = (props) => {
    const [mesh] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, -Math.PI / 2] }))
    const [box, api] = useBox(() => ({
        mass: 1,
        args: [2, 2, 2],
        position: [0, BOX_SIZE / 2, 0]
    }))
    const controls = usePersonControls();
    const position = useRef([0, 0, 0]);
    const speed = 0.05;

    useEffect(() => {
        const unsubscribe = api.position.subscribe((v) => (position.current = v))
        return unsubscribe
    }, [])

    useFrame(() => {
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
    })

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
            <mesh castShadow ref={box}>
                <boxBufferGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
                <meshStandardMaterial attach="material" color="gray" />
            </mesh>
            <mesh receiveShadow ref={mesh} {...props}>
                <planeBufferGeometry attach="geometry" args={[GRID_SIZE, GRID_SIZE]} />
                <meshStandardMaterial attach="material" color="gray" />
            </mesh>

            {childrenWithProps}
        </group>
    )
}

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
                    <MyMap>
                        <group>
                            <MyCube position={[0, 5, 0]} />
                            <MyCube position={[5, 10, 4]} />
                        </group>
                    </MyMap>
                </Physics>
            </Suspense>
            <Stars />
        </Canvas>
    )
}
