<script lang="ts">
    import { orderStore } from '$lib/orderStore';
    import Pricing from './Pricing.svelte';

    let orderStatus = '';
    let isSubmitting = false;

    function updateQuantity(event: Event) {
        const value = parseInt((event.target as HTMLInputElement).value);
        const quantity = Math.max(1, value);
        orderStore.update(store => ({ ...store, quantity }));
    }

    function updateOrderDetails(event: Event) {
        const input = event.target as HTMLInputElement;
        orderStore.update(store => ({
            ...store,
            [input.name]: input.value
        }));
    }

    async function submitOrder() {
        isSubmitting = true;
        // Here you would typically make an API call to submit the order
        // For now, we'll simulate it with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        orderStatus = 'Order received';
        isSubmitting = false;
    }
</script>

<div class="order-container">
    <div class="order-form">
        <h2>Order Details</h2>
        <div class="quantity-control">
            <label for="quantity">Quantity:</label>
            <input 
                type="number"
                id="quantity"
                min="1"
                value={$orderStore.quantity}
                on:input={updateQuantity}
            />
        </div>

        <div class="contact-details">
            <h3>Contact Details</h3>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={$orderStore.email}
                    on:input={updateOrderDetails}
                    required
                />
            </div>

            <div class="form-group">
                <label for="companyNumber">Company Number:</label>
                <input
                    type="text"
                    id="companyNumber"
                    name="companyNumber"
                    value={$orderStore.companyNumber}
                    on:input={updateOrderDetails}
                    required
                />
            </div>
        </div>

        <div class="address-details">
            <h3>Delivery Address</h3>
            
            <div class="form-group">
                <label for="companyName">Company Name:</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={$orderStore.companyName}
                    on:input={updateOrderDetails}
                    required
                />
            </div>

            <div class="form-group">
                <label for="streetAddress">Street Address:</label>
                <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={$orderStore.streetAddress}
                    on:input={updateOrderDetails}
                    required
                />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="postalCode">Postal Code:</label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={$orderStore.postalCode}
                        on:input={updateOrderDetails}
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={$orderStore.city}
                        on:input={updateOrderDetails}
                        required
                    />
                </div>
            </div>
        </div>

        <button 
            class="submit-button" 
            on:click={submitOrder} 
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Submitting...' : 'Place Order'}
        </button>

        {#if orderStatus}
            <div class="order-status">
                {orderStatus}
            </div>
        {/if}
    </div>

    <div class="pricing-section">
        <Pricing />
    </div>
</div>

<style>
    .order-container {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 2rem;
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .order-form {
        max-width: 100%;
        margin: 0;
    }

    .pricing-section {
        position: sticky;
        top: 2rem;
        height: fit-content;
    }

    h2 {
        margin: 0 0 1.5rem 0;
    }

    @media (max-width: 768px) {
        .order-container {
            grid-template-columns: 1fr;
        }

        .pricing-section {
            position: static;
        }
    }

    .quantity-control {
        margin: 1rem 0;
    }

    .contact-details,
    .address-details {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    h3 {
        margin: 0 0 1rem 0;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #666;
    }

    .submit-button {
        width: 100%;
        padding: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.1em;
    }

    .submit-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .submit-button:hover:not(:disabled) {
        background-color: #0056b3;
    }

    .order-status {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #d4edda;
        color: #155724;
        border-radius: 4px;
        text-align: center;
    }
</style>
