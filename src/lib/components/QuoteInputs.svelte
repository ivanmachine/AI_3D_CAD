<script lang="ts">
    import { orderStore } from '$lib/orderStore';
    import { modelStore } from '$lib/inputStore';
    import options from '$lib/options.json';
    
    let selectedFile: File | null = null;

    function handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            selectedFile = input.files[0];
            orderStore.update(store => ({
                ...store,
                cadFile: selectedFile
            }));
        }
    }

    function handleThicknessChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const thickness = parseFloat(select.value);
        
        orderStore.update(store => ({
            ...store,
            metalThickness: select.value
        }));
    }
</script>

<div class="quote-inputs">
    <div class="input-group file-input">
        <label for="cad-file">Upload CAD File:</label>
        <input 
            type="file" 
            id="cad-file" 
            accept=".stl,.obj,.step,.stp,.png,.jpg,.jpeg"
            on:change={handleFileUpload}
        >
    </div>

    <div class="form-overlay" class:active={!selectedFile}>
        <div class="overlay-message">Please upload a CAD file to continue</div>
    </div>

    <div class="other-inputs" class:disabled={!selectedFile}>
        <div class="input-group">
            <label for="metal-type">Metal Type:</label>
            <select 
                id="metal-type"
                bind:value={$orderStore.metalType}
                disabled={!selectedFile}
            >
                <option value="">Select metal type</option>
                {#each options.metalTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label for="thickness">Metal Thickness:</label>
            <select 
                id="thickness"
                bind:value={$orderStore.metalThickness}
                on:change={handleThicknessChange}
                disabled={!selectedFile}
            >
                <option value="">Select thickness</option>
                {#each options.metalThickness as thickness}
                    <option value={thickness}>{thickness}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label for="finish">Finish:</label>
            <select 
                id="finish"
                bind:value={$orderStore.finish}
                disabled={!selectedFile}
            >
                <option value="">Select finish</option>
                {#each options.finishes as finish}
                    <option value={finish}>{finish}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label for="quantity">Quantity:</label>
            <input 
                type="number" 
                id="quantity"
                min="1"
                bind:value={$orderStore.quantity}
                disabled={!selectedFile}
            >
        </div>
    </div>
</div>

<style>
    .quote-inputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    select, input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    label {
        font-weight: 500;
    }

    .form-overlay {
        display: none;
        position: absolute;
        background: rgba(128, 128, 128, 0.7);
        top: 4rem; /* Adjust based on your layout to position below file input */
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
    }

    .form-overlay.active {
        display: flex;
    }

    .overlay-message {
        background: white;
        padding: 1rem;
        border-radius: 4px;
        font-weight: 500;
    }

    .other-inputs {
        position: relative;
    }

    .other-inputs.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    .file-input {
        z-index: 10;
    }
</style>
