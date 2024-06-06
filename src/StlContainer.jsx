import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import pako from 'pako';

const decompressSTL = async (compressedUrl) => {
    const response = await fetch(compressedUrl);
    const compressedData = await response.arrayBuffer();
    const decompressedData = pako.inflate(new Uint8Array(compressedData));
    return new Blob([decompressedData], { type: 'application/vnd.ms-pki.stl' });
};

const loadSTL = (scene, url) => {
    decompressSTL(url).then(blob => {
        const loader = new STLLoader();
        loader.load(URL.createObjectURL(blob), geometry => {
            const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        });
    });
};

const STLViewer = ({ compressedUrl }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 1).normalize();
        scene.add(light);

        camera.position.z = 5;

        loadSTL(scene, compressedUrl);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [compressedUrl]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};


export default function StlContainer() {
    return (
        <div className="App" style={{ width: '100vw', height: '100vh' }}>
            <STLViewer compressedUrl={require('./66d0fd4ad54336f8d4cf97a843940468.stl.gz')} />
        </div>)
}