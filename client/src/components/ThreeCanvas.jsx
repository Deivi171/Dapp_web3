import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ThreeCanvas = () => {
    const canvasRef = useRef(null);
    const modelRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Initial Camera Position
        camera.position.z = 5;

        // Load Model
        const loader = new GLTFLoader();
        loader.load(
            '/images/logo3d.glb', // Assuming the file is served from public/images or similar
            (gltf) => {
                const model = gltf.scene;
                modelRef.current = model;

                // Create a group for the scroll animation
                const scrollGroup = new THREE.Group();
                scrollGroup.add(model);
                scene.add(scrollGroup);

                // Initial Position (Section 1)
                // Adjust these values based on your model scale and preference
                scrollGroup.position.set(-2.5, -1.5, 0);
                scrollGroup.rotation.set(0, 0, 0);
                model.scale.set(0.85, 0.85, 0.85); // Adjusted scale for typical logo size

                // Idle Animation (Constant Spin)
                gsap.to(model.rotation, {
                    y: Math.PI * 2,
                    duration: 20,
                    repeat: -1,
                    ease: "linear"
                });

                // Animation Timeline
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                // Section 1 -> Section 2
                // Move from Left (-4) to Right (4)
                tl.to(scrollGroup.position, {
                    x: 4,
                    y: 0,
                    z: 0,
                    duration: 1,
                    ease: "power1.inOut"
                }, "start");

                // Section 2 -> Section 3
                // Move from Right (4) to Center Bottom (0, -2.5) AND Rotate to Horizontal
                tl.to(scrollGroup.position, {
                    x: 0,
                    y: -1.8,
                    z: 0,
                    duration: 1,
                    ease: "power1.inOut"
                }, "middle");

                // Rotate to lie flat (90 degrees on Z axis)
                tl.to(scrollGroup.rotation, {
                    z: Math.PI / 2,
                    duration: 1,
                    ease: "power1.inOut"
                }, "middle");

            },
            undefined,
            (error) => {
                console.error('An error occurred loading the model:', error);
            }
        );

        // Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderer.domElement && document.body.contains(renderer.domElement)) {
                // document.body.removeChild(renderer.domElement); // We are rendering in a React component, so React handles removal
            }
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
        />
    );
};

export default ThreeCanvas;
