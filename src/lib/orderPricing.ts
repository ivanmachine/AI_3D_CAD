interface MaterialPrices {
    [key: string]: number;
}

const MATERIAL_PRICES_PER_CM2: MaterialPrices = {
    'Steel': 2,
    'Aluminum': 3,
    'Stainless Steel': 4,
    'Brass': 5
};

const THICKNESS_MULTIPLIER: MaterialPrices = {
    '1mm': 1,
    '2mm': 1.5,
    '3mm': 2,
    '4mm': 2.5,
    '5mm': 3
};

const FINISH_PRICES: MaterialPrices = {
    'Raw': 0,
    'Brushed': 100,
    'Polished': 150,
    'Powder Coated': 200,
    'Anodized': 250
};

export function getMaterialUsageInSquareCM(file: File | null): number {
    // TODO: Implement actual file parsing logic
    return 12; // Hardcoded value for now
}

export interface PricingBreakdown {
    material: number;
    manufacturing: number;
    shipping: number;
    mva: number;
    total: number;
}

export function calculatePricing(
    materialType: string,
    materialUsage: number,
    thickness: string,
    finish: string
): PricingBreakdown {
    const materialPrice = MATERIAL_PRICES_PER_CM2[materialType] || 0;
    const thicknessMultiplier = THICKNESS_MULTIPLIER[thickness] || 1;
    const finishPrice = FINISH_PRICES[finish] || 0;

    const material = materialPrice * materialUsage * thicknessMultiplier;
    const manufacturing = 200;
    const shipping = 150;
    
    const subtotal = material + manufacturing + finishPrice + shipping;
    const mva = subtotal * 0.25;
    const total = subtotal + mva;

    return {
        material,
        manufacturing: manufacturing + finishPrice, // Including finish price in manufacturing
        shipping,
        mva,
        total
    };
}