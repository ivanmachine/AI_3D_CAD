import { writable } from 'svelte/store';
import type { ModelDefinition } from './cad';

const initialModel: ModelDefinition = {
    ai_model: null,
    model: {
        depth: 20,
        components: [
            {
                id: 'base',
                type: 'rectangle',
                width: 100,
                height: 5,
                depth: 50,
                position: { x: 0, y: 0, z: 0 }
            },
            {
                id: 'hole1',
                type: 'hole',
                radius: 5,
                depth: 50,
                position: { x: 25, y: 0, z: 0 }
            }
        ],
        operations: [
            {
                type: 'subtract',
                targetId: 'base',
                modifierId: 'hole1'
            }
        ]
    }
};

export const modelStore = writable<ModelDefinition>(initialModel);

