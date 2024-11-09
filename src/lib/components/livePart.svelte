<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { modelStore } from '$lib/inputStore';
    import { orderStore } from '$lib/orderStore';
    import { createComponent } from '$lib/createComponent';
    import { CSG } from 'three-csg-ts';
    import type { OrderDetails } from '$lib/orderStore';
    import type { ModelDefinition } from '$lib/cad';

    let canvas: HTMLCanvasElement;
    
    // Material property mappings
    const materialProperties = {
        'Stainless Steel': {
            color: 0x88898c,
            metalness: 0.9,
            roughness: 0.3,
        },
        'Aluminum': {
            color: 0xd4d4d4,
            metalness: 0.6,
            roughness: 0.4,
        },
        'Brass': {
            color: 0xd4a017,
            metalness: 0.8,
            roughness: 0.3,
        }
    };

    const finishProperties = {
        'Polished': { roughness: 0.1 },
        'Brushed': { roughness: 0.4 },
        'Matte': { roughness: 0.7 }
    };

    // Add default values
    const DEFAULT_MATERIAL = {
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.3,
    };

    const DEFAULT_FINISH = {
        roughness: 0.3
    };

    onMount(() => {
        // ... existing scene setup code from Renderer.svelte ...
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: true,
            physicallyCorrectLights: true
        });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);

        let meshes: THREE.Mesh[] = [];

        // Subscribe to both stores
        const unsubscribeModel = modelStore.subscribe((modelDef: ModelDefinition) => {
            orderStore.subscribe((orderDetails: OrderDetails) => {
                // Clean up existing meshes
                meshes.forEach(mesh => scene.remove(mesh));
                meshes = [];

                const meshMap = new Map<string, THREE.Mesh>();

                // Add safety checks for material properties
                const baseMaterial = materialProperties[orderDetails?.metalType] || DEFAULT_MATERIAL;
                const finishMod = finishProperties[orderDetails?.finish] || DEFAULT_FINISH;

                modelDef.model.components.forEach(component => {
                    const mesh = createComponent(component);
                    
                    // Create material with combined properties
                    const material = new THREE.MeshStandardMaterial({
                        ...baseMaterial,
                        roughness: finishMod.roughness,
                    });
                    
                    mesh.material = material;
                    meshMap.set(component.id, mesh);
                });

                // Process operations
                modelDef.model.operations.forEach(operation => {
                    // ... existing operation processing code ...
                    const targetMesh = meshMap.get(operation.targetId);
                    const modifierMesh = meshMap.get(operation.modifierId);
                    
                    if (!targetMesh || !modifierMesh) return;

                    let resultMesh: THREE.Mesh;
                    switch (operation.type) {
                        case 'subtract':
                            resultMesh = CSG.subtract(targetMesh, modifierMesh);
                            break;
                        case 'union':
                            resultMesh = CSG.union(targetMesh, modifierMesh);
                            break;
                        case 'intersect':
                            resultMesh = CSG.intersect(targetMesh, modifierMesh);
                            break;
                    }

                    meshMap.set(operation.targetId, resultMesh);
                });

                // Add final meshes to scene
                for (const [id, mesh] of meshMap) {
                    if (!modelDef.model.operations.some(op => 
                        op.type === 'subtract' && op.modifierId === id)) {
                        scene.add(mesh);
                        meshes.push(mesh);
                    }
                }
            });
        });

        // Camera and controls setup
        camera.position.set(50, 50, 100);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        return () => {
            unsubscribeModel();
        };
    });
</script>

<div class="live-part">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .live-part {
        position: absolute;
        top: 0;
        right: 0;
        width: 300px;
        height: 200px;
    }

    canvas {
        width: 100%;
        height: 100%;
        cursor: grab;
    }

    canvas:active {
        cursor: grabbing;
    }
</style>
