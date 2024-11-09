<script>
    import Inputs from "../lib/components/Inputs.svelte";
    import Renderer from "../lib/components/Renderer.svelte";
    import { page } from '$app/stores';
    import Pricing from "$lib/components/Pricing.svelte";
    import QuoteInputs from "$lib/components/QuoteInputs.svelte";
    import LivePart from "$lib/components/livePart.svelte";
    import Order from "$lib/components/Order.svelte";
    
    // Default to 'design' if no step parameter
    $: currentStep = $page.url.searchParams.get('step') || 'design';
</script>

<main class="max-w-[1300px] mx-auto">
    <div class="steps-container max-w-[800px] mx-auto">
        <div class="steps-wrapper flex justify-between items-center relative">
            <!-- Connection lines -->
            <div class="absolute top-1/2 left-[20%] right-[20%] h-[2px] bg-gray-300" />
            
            <!-- Step buttons -->
            <a href="?step=design" class="step-btn z-10 text-center">
                <div class={"circle " + (currentStep === 'design' ? 'active' : '')}>1</div>
                <span class="label">Design</span>
            </a>
            <a href="?step=quote" class="step-btn z-10 text-center">
                <div class={"circle " + (currentStep === 'quote' ? 'active' : '')}>2</div>
                <span class="label">Quote</span>
            </a>
            <a href="?step=order" class="step-btn z-10 text-center">
                <div class={"circle " + (currentStep === 'order' ? 'active' : '')}>3</div>
                <span class="label">Order</span>
            </a>
        </div>
    </div>

    <!-- Content based on current step -->
    {#if currentStep === 'design'}
        <div class="grid grid-cols-2 gap-8">
            <Inputs />
            <Renderer />
        </div>
    {:else if currentStep === 'quote'}
        <div class="grid grid-cols-2 gap-8">
            <QuoteInputs />
            <Pricing />
            <LivePart />
        </div>
    {:else if currentStep === 'order'}
        <div class="grid grid-cols-2 gap-8">
            <Order />
        </div>
    {/if}
</main>

<style>
    .steps-wrapper {
        padding: 0 10%;
    }

    .circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        border: 2px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 8px;
    }
    
    .circle.active {
        background: #4CAF50;
        color: white;
        border-color: #4CAF50;
    }
    
    .label {
        font-weight: 500;
        color: #666;
    }
    
    .step-btn {
        text-decoration: none;
        cursor: pointer;
    }
    
    main {
        margin-top: 100px;
    }
</style>    