import { writable } from 'svelte/store';
import options from './options.json';

export interface OrderDetails {
    cadFile: File | null;
    metalType: string;
    metalThickness: string;
    finish: string;
    quantity: number;
}

// Initialize with first options from options.json
export const orderStore = writable<OrderDetails>({
    cadFile: null,
    metalType: options.metalTypes[0],
    metalThickness: options.metalThickness[0],
    finish: options.finishes[0],
    quantity: 1
});
