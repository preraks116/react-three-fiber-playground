import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThree } from "@react-three/fiber";


const GRID_SIZE = 20
    
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

export { CameraController };