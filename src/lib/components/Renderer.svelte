<script lang="ts">
    import * as THREE from 'three';
    import { onMount } from 'svelte';
    import { modelStore } from '$lib/inputStore';
    import type { ModelDefinition, ModelComponent } from '$lib/cad';
    import { CSG } from 'three-csg-ts';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { createComponent } from '$lib/createComponent';
    import { TextureLoader } from 'three';
  
    let canvas: HTMLCanvasElement;
    
    onMount(() => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      // Enhanced lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      // Add multiple directional lights for better reflections
      const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
      mainLight.position.set(5, 5, 5);
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
      fillLight.position.set(-5, 0, -5);
      scene.add(fillLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
      topLight.position.set(0, 5, 0);
      scene.add(topLight);

      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        physicallyCorrectLights: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      });
  
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  
      // Track all meshes for cleanup
      let meshes: THREE.Mesh[] = [];
      
      
      
      // Subscribe to the store and update the scene when it changes
      const unsubscribe = modelStore.subscribe((modelDef: ModelDefinition) => {
        // Clean up existing meshes
        meshes.forEach(mesh => scene.remove(mesh));
        meshes = [];

        // Create a map of id to mesh for easy lookup
        const meshMap = new Map<string, THREE.Mesh>();
        
        // Add after scene creation and before lighting setup
        const textureLoader = new TextureLoader();
        // Load texture maps - you'll need to add these files to your project
        const normalMap = textureLoader.load('/textures/metal_normal.jpg');

        // First pass: create all meshes
        modelDef.model.components.forEach(component => {
          const mesh = createComponent(component);
          
          // Add metallic material properties
          const material = new THREE.MeshStandardMaterial({
            color: 0x888888,  // Metallic gray color
            metalness: 0.8,
            roughness: 0.5,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.5, 0.5),
          });
          
          mesh.material = material;
          meshMap.set(component.id, mesh);
        });

        // Second pass: apply operations
        modelDef.model.operations.forEach(operation => {
          const targetMesh = meshMap.get(operation.targetId);
          const modifierMesh = meshMap.get(operation.modifierId);
          
          if (!targetMesh || !modifierMesh) {
            console.error('Missing mesh for operation:', operation);
            return;
          }

          // Clone meshes to prevent modifications to originals
          const targetClone = targetMesh.clone();
          const modifierClone = modifierMesh.clone();

          // Ensure matrices are updated
          targetClone.updateMatrix();
          modifierClone.updateMatrix();

          let resultMesh: THREE.Mesh;
          switch (operation.type) {
            case 'subtract':
              resultMesh = CSG.subtract(targetClone, modifierClone);
              // Copy position from original target
              resultMesh.position.copy(targetClone.position);
              break;
            case 'union':
              resultMesh = CSG.union(targetClone, modifierClone);
              break;
            case 'intersect':
              resultMesh = CSG.intersect(targetClone, modifierClone);
              break;
          }

          // Update the mesh map with the result
          meshMap.set(operation.targetId, resultMesh);
        });

        // Add final meshes to scene
        for (const [id, mesh] of meshMap) {
          // Only add meshes that aren't used as modifiers in subtract operations
          if (!modelDef.model.operations.some(op => op.type === 'subtract' && op.modifierId === id)) {
            scene.add(mesh);
            meshes.push(mesh);
          }
        }
      });
  
      camera.position.z = 100; // Adjusted for better view
      camera.position.y = 50;
      camera.lookAt(0, 0, 0);
  
      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // Adds smooth damping effect
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2; // Prevent going below the ground plane

      // Update the animate function to include controls
      function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Required for damping
        renderer.render(scene, camera);
      }
      animate();
      
      return () => unsubscribe();
    });
  </script>
  
  <canvas bind:this={canvas} width="800" height="600"></canvas>
  
  <style>
    canvas {
      display: block;
      width: 100%;
      height: 100%;
      cursor: grab; /* Shows grab cursor when hoverable */
    }
    
    /* Optional: Change cursor when dragging */
    canvas:active {
      cursor: grabbing;
    }
  </style>
  