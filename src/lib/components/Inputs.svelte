<script lang="ts">
    import { modelStore } from '$lib/inputStore';
    import type { RectangleComponent } from '$lib/cad';
    import { fetchOpenAI } from '$lib/fetchOpenAI';
    import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';
    // Create reactive bindings to the first component and ensure it's a rectangle
    $: baseComponent = $modelStore.model.components[0];
    $: rectangleComponent = baseComponent?.type === 'rectangle' 
        ? (baseComponent as RectangleComponent) 
        : null;
    let prompt: string | null = null;
    let loading: boolean = false;
    $: holeComponent = $modelStore.model.components[1]?.type === 'hole' 
        ? $modelStore.model.components[1] 
        : null;
    async function handleClick() {
        try {
        loading = true;
        const res = await fetchOpenAI(PUBLIC_OPENAI_API_KEY, prompt, $modelStore.model);
        if(res) {
            $modelStore.ai_model = res;
            $modelStore.model = res;
        } 
        } catch (error) {
            alert('Error fetching AI model');
        } finally {
            loading = false;    
        }
    }
</script>


{#if rectangleComponent}
    <div class="input-controls">
        <label>
            Width: {rectangleComponent.width}
            <input 
                type="range" 
                min="0" 
                max="200" 
                value={rectangleComponent.width}
                on:input={(e) => {
                    $modelStore.model.components[0].width = Number(e.target.value);
                }}
            />
        </label>

        <label>
            Height: {rectangleComponent.height}
            <input 
                type="range" 
                min="0" 
                max="200" 
                value={rectangleComponent.height}
                on:input={(e) => {
                    $modelStore.model.components[0].height = Number(e.target.value);
                }}
            />
        </label>

        <label>
            Depth: {rectangleComponent.depth}
            <input 
                type="range" 
                min="0" 
                max="50" 
                value={rectangleComponent.depth}
                on:input={(e) => {
                    $modelStore.model.components[0].depth = Number(e.target.value);
                }}
            />
        </label>
        <label>
            Text: {rectangleComponent.text}
            <input 
                class="text_input"
                bind:value={prompt}
                type="text" 
                placeholder="Ask AI for help"
                />
        </label>
        <button on:click={handleClick} disabled={loading}>{loading ? 'Loading...' : 'Send'}</button>

        {#if false}
            <div class="hole-controls">
                <h3>Hole Position</h3>
                <label>
                    X: {holeComponent.position.x}
                    <input 
                        type="range" 
                        min="-50" 
                        max="50" 
                        value={holeComponent.position.x}
                        on:input={(e) => {
                            const updatedModel = {
                                ...$modelStore,
                                model: {
                                    ...$modelStore.model,
                                    components: [...$modelStore.model.components]
                                }
                            };
                            updatedModel.model.components[1] = {
                                ...updatedModel.model.components[1],
                                position: {
                                    ...updatedModel.model.components[1].position,
                                    x: Number(e.target.value)
                                }
                            };
                            $modelStore = updatedModel;
                        }}
                    />
                </label>

                <label>
                    Y: {holeComponent.position.y}
                    <input 
                        type="range" 
                        min="-50" 
                        max="50" 
                        value={holeComponent.position.y}
                        on:input={(e) => {
                            const updatedModel = {
                                ...$modelStore,
                                model: {
                                    ...$modelStore.model,
                                    components: [...$modelStore.model.components]
                                }
                            };
                            updatedModel.model.components[1] = {
                                ...updatedModel.model.components[1],
                                position: {
                                    ...updatedModel.model.components[1].position,
                                    y: Number(e.target.value)
                                }
                            };
                            $modelStore = updatedModel;
                        }}
                    />
                </label>

                <label>
                    Z: {holeComponent.position.z}
                    <input 
                        type="range" 
                        min="-25" 
                        max="25" 
                        value={holeComponent.position.z}
                        on:input={(e) => {
                            const updatedModel = {
                                ...$modelStore,
                                model: {
                                    ...$modelStore.model,
                                    components: [...$modelStore.model.components]
                                }
                            };
                            updatedModel.model.components[1] = {
                                ...updatedModel.model.components[1],
                                position: {
                                    ...updatedModel.model.components[1].position,
                                    z: Number(e.target.value)
                                }
                            };
                            $modelStore = updatedModel;
                        }}
                    />
                </label>
            </div>
        {/if}
    </div>
{:else}
    <p>No rectangle component found</p>
{/if}

<style>
    .input-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        display: flex;
        flex-direction: column;
    }
    button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
    }
    .text_input {
        border: 1px solid #ccc;
        padding: 5px;
}

    .hole-controls {
        border-top: 1px solid #ccc;
        padding-top: 1rem;
        margin-top: 1rem;
    }
</style>
