import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ThreeCanvas = () => {
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        let renderer;
        let animationId;

        try {
            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({
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

                    // Collect materials for opacity animation
                    const materials = [];
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.transparent = true;
                            child.material.opacity = 1;
                            materials.push(child.material);
                        }
                    });

                    // Create a group for the scroll animation
                    const scrollGroup = new THREE.Group();
                    scrollGroup.add(model);
                    scene.add(scrollGroup);

                    // Initial Position (Section 1)
                    // Adjust these values based on your model scale and preference
                    scrollGroup.position.set(-3.5, -1.5, 0);
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

                    // Section 1 -> Section 2 (0% to 33% of scroll)
                    // Move from Left (-3.5) to Right (4) AND Center Vertically (0)
                    tl.to(scrollGroup.position, {
                        x: 4,
                        y: 0, // Center vertically
                        z: 0,
                        duration: 1,
                        ease: "power1.inOut"
                    }, 0); // Start at 0

                    tl.to(model.scale, {
                        x: 1.5,
                        y: 1.5,
                        z: 1.5,
                        duration: 1,
                        ease: "power1.inOut"
                    }, 0); // Start at 0

                    // Section 2 Hold (33% to 66% of scroll)
                    // No movement, just hold position

                    // Section 2 -> Section 3 (66% to 100% of scroll)
                    // Fade Out (Opacity -> 0)
                    if (materials.length > 0) {
                        tl.to(materials, {
                            opacity: 0,
                            duration: 1,
                            ease: "power1.inOut"
                        }, 2); // Start at 2 (after hold)
                    }

                },
                undefined,
                (error) => {
                    console.error('An error occurred loading the model:', error);
                    setHasError(true);
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
                animationId = requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };

            animate();

            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                if (animationId) cancelAnimationFrame(animationId);
                if (renderer) renderer.dispose();
                ScrollTrigger.getAll().forEach(t => t.kill());
            };
        } catch (error) {
            console.error('ThreeCanvas error:', error);
            setHasError(true);
        }
    }, []);

    // Si hay error, no renderizar nada
    if (hasError) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        />
    );
};

export default ThreeCanvas;
