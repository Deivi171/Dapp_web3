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
            
            // Configurar tone mapping para mejor iluminación
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;

            // Luces con colores de la página (morado, rosa, azul)
            const ambientLight = new THREE.AmbientLight(0x332244, 0.8);
            scene.add(ambientLight);

            // Luz principal frontal (blanca)
            const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
            frontLight.position.set(0, 0, 10);
            scene.add(frontLight);

            // Luz desde arriba (rosa/magenta como la tarjeta)
            const topLight = new THREE.DirectionalLight(0xff6b9d, 1.5);
            topLight.position.set(0, 10, 5);
            scene.add(topLight);

            // Luz desde la derecha (azul/púrpura)
            const rightLight = new THREE.DirectionalLight(0x8945F8, 1.2);
            rightLight.position.set(10, 0, 5);
            scene.add(rightLight);

            // Luz desde la izquierda (rosa)
            const leftLight = new THREE.DirectionalLight(0xff4d6d, 1.0);
            leftLight.position.set(-10, 0, 5);
            scene.add(leftLight);

            // Luz desde abajo (azul oscuro)
            const bottomLight = new THREE.DirectionalLight(0x2952e3, 0.8);
            bottomLight.position.set(0, -10, 5);
            scene.add(bottomLight);

            // Luz trasera para brillo en bordes
            const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
            backLight.position.set(0, 0, -10);
            scene.add(backLight);

            // Initial Camera Position
            camera.position.z = 5;

            // Load Model
            const loader = new GLTFLoader();
            loader.load(
                '/images/ethereum_logo.glb', // Assuming the file is served from public/images or similar
                (gltf) => {
                    const model = gltf.scene;
                    modelRef.current = model;

                    // Collect materials for opacity animation
                    const materials = [];
                    model.traverse((child) => {
                        if (child.isMesh) {
                            // Crear material metálico con colores de la página
                            const newMaterial = new THREE.MeshStandardMaterial({
                                color: 0x8855cc, // Color base púrpura
                                metalness: 0.9,
                                roughness: 0.2,
                                transparent: true,
                                opacity: 1,
                                envMapIntensity: 1.5,
                            });
                            
                            child.material = newMaterial;
                            materials.push(child.material);
                        }
                    });

                    // Create a group for the scroll animation
                    const scrollGroup = new THREE.Group();
                    scrollGroup.add(model);
                    scene.add(scrollGroup);

                    // Initial Position - más a la izquierda para no chocar con el formulario
                    scrollGroup.position.set(-2.7, -1.7, 0);
                    scrollGroup.rotation.set(0, 0, 0);
                    model.scale.set(0.85, 0.85, 0.85);

                    // Idle Animation - Rotación constante
                    gsap.to(model.rotation, {
                        y: Math.PI * 2,
                        duration: 15,
                        repeat: -1,
                        ease: "linear"
                    });

                    // Efecto de flotación (arriba/abajo) cuando está quieto
                    const floatAnimation = gsap.to(scrollGroup.position, {
                        y: "-=0.3",
                        duration: 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });

                    // Animation Timeline con scroll
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: "body",
                            start: "top top",
                            end: "50% top", // Termina antes, al 50% del scroll
                            scrub: 1,
                            onUpdate: (self) => {
                                // Pausar flotación mientras hace scroll activo
                                if (self.direction !== 0) {
                                    floatAnimation.pause();
                                } else {
                                    floatAnimation.resume();
                                }
                            }
                        }
                    });

                    // Moverse hacia la derecha pero quedándose en el lado izquierdo (no al centro)
                    tl.to(scrollGroup.position, {
                        x: 2.2, // Se mueve a la derecha pero no tanto
                        y: 0,
                        z: 0,
                        duration: 1,
                        ease: "power1.inOut"
                    }, 0);

                    // Crece un poco
                    tl.to(model.scale, {
                        x: 1.0,
                        y: 1.0,
                        z: 1.0,
                        duration: 1,
                        ease: "power1.inOut"
                    }, 0);

                    // Fade out más temprano - desaparece antes de Latest Transactions
                    if (materials.length > 0) {
                        tl.to(materials, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power1.inOut"
                        }, 0.9); // Empieza el fade a 70% de la animación
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
