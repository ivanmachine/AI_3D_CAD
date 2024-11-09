import * as THREE from 'three';
import type { ModelComponent } from './cad';

export function createComponent(component: ModelComponent): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        metalness: 1.0,
        roughness: 0.33,
        envMapIntensity: 1.0,
    });
    
    switch (component.type) {
        case 'rectangle':
            geometry = new THREE.BoxGeometry(
                component.width,
                component.height,
                component.depth
            );
            break;
        case 'cylinder':
        case 'hole':
            geometry = new THREE.CylinderGeometry(
                component.radius,
                component.radius,
                component.depth,
                32
            );
            // For holes, rotate the geometry instead of the mesh
         
            break;
        default:
            throw new Error(`Unsupported component type: ${component.type}`);
    }

    const mesh = new THREE.Mesh(geometry, material);
    
    // Set position for all components
    mesh.position.set(
        component.position.x,
        component.position.y,
        component.position.z
    );

    // Important: Update the matrix for proper CSG operations
    mesh.updateMatrix();

    return mesh;
}