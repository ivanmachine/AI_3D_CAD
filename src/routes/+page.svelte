<script>
    import Inputs from "./Inputs.svelte";
    import Renderer from "./Renderer.svelte";
    import { modelStore } from "$lib/inputStore";
</script>

<main class="max-w-[1300px] mx-auto">
    <div class="grid grid-cols-2 gap-8">
        <Inputs />
        <Renderer />
    </div>
</main>

<style>
    main {
        margin-top: 200px;
    }
</style>    