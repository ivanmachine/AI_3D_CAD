<script lang="ts">
    import { orderStore } from '$lib/orderStore';
    import { calculatePricing, getMaterialUsageInSquareCM } from '$lib/orderPricing';
    
    $: materialUsage = getMaterialUsageInSquareCM($orderStore.cadFile);
    $: pricing = calculatePricing(
        $orderStore.metalType,
        materialUsage,
        $orderStore.metalThickness,
        $orderStore.finish
    );
    
    $: totalWithQuantity = {
        material: pricing.material * $orderStore.quantity,
        manufacturing: pricing.manufacturing * $orderStore.quantity,
        shipping: pricing.shipping,
        mva: (pricing.material + pricing.manufacturing) * $orderStore.quantity * 0.25 + pricing.shipping * 0.25,
        total: (pricing.material + pricing.manufacturing) * $orderStore.quantity * 1.25 + pricing.shipping * 1.25
    };
</script>

<div class="pricing-breakdown">
    <h2>Price Breakdown</h2>
    
    <div class="pricing-table">
        <div class="row">
            <span>Material ({$orderStore.quantity} units):</span>
            <span>NOK {totalWithQuantity.material}</span>
        </div>
        <div class="row">
            <span>Manufacturing ({$orderStore.quantity} units):</span>
            <span>NOK {totalWithQuantity.manufacturing}</span>
        </div>
        <div class="row">
            <span>Shipping:</span>
            <span>NOK {totalWithQuantity.shipping}</span>
        </div>
        <div class="row mva">
            <span>MVA (25%):</span>
            <span>NOK {totalWithQuantity.mva}</span>
        </div>
        <div class="row total">
            <span>Total:</span>
            <span>NOK {totalWithQuantity.total}</span>
        </div>
    </div>
</div>

<style>
    .pricing-breakdown {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    h2 {
        margin: 0 0 1rem 0;
    }

    .pricing-table {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    .mva {
        border-bottom: 2px solid #ccc;
    }

    .total {
        font-weight: bold;
        font-size: 1.1em;
        border-bottom: none;
    }
</style>
