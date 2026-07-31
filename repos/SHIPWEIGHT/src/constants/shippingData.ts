export interface ShippingPlatform {
  name: string;
  rates: {
    minWeightOz: number;
    maxWeightOz: number;
    cost: number;
    serviceName: string;
    policy?: string;
  }[];
  flatRate?: {
    maxWeightLb: number;
    cost: number;
  };
}

export const PLATFORMS: ShippingPlatform[] = [
  {
    name: "Poshmark",
    flatRate: {
      maxWeightLb: 5,
      cost: 7.97,
    },
    rates: [],
  },
  {
    name: "eBay (Calculated Shipping)",
    rates: [
      // Ground Advantage
      { minWeightOz: 0, maxWeightOz: 4, cost: 4.15, serviceName: "Ground Advantage (4oz)", policy: "Standard" },
      { minWeightOz: 4.1, maxWeightOz: 8, cost: 4.90, serviceName: "Ground Advantage (8oz)", policy: "Standard" },
      { minWeightOz: 8.1, maxWeightOz: 12, cost: 5.60, serviceName: "Ground Advantage (12oz)", policy: "Standard" },
      { minWeightOz: 12.1, maxWeightOz: 15.9, cost: 6.80, serviceName: "Ground Advantage (15.9oz)", policy: "Standard" },
      // Priority Mail
      { minWeightOz: 16, maxWeightOz: 32, cost: 8.50, serviceName: "Priority Mail (1-2lb)", policy: "Expedited" },
      { minWeightOz: 32.1, maxWeightOz: 48, cost: 12.50, serviceName: "Priority Mail (2-3lb)", policy: "Expedited" },
      { minWeightOz: 48.1, maxWeightOz: 64, cost: 15.75, serviceName: "Priority Mail (3-4lb)", policy: "Expedited" },
      { minWeightOz: 64.1, maxWeightOz: 80, cost: 19.20, serviceName: "Priority Mail (4-5lb)", policy: "Expedited" },
    ],
  },
  {
    name: "Etsy",
    rates: [
      { minWeightOz: 0, maxWeightOz: 4, cost: 4.25, serviceName: "First Class (4oz)" },
      { minWeightOz: 4.1, maxWeightOz: 8, cost: 5.10, serviceName: "First Class (8oz)" },
      { minWeightOz: 8.1, maxWeightOz: 12, cost: 5.85, serviceName: "First Class (12oz)" },
      { minWeightOz: 12.1, maxWeightOz: 15.9, cost: 7.15, serviceName: "First Class (1lb)" },
      { minWeightOz: 16, maxWeightOz: 32, cost: 9.25, serviceName: "Priority (2lb)" },
    ],
  },
  {
    name: "UPS (eBay Rates)",
    rates: [
      { minWeightOz: 16, maxWeightOz: 32, cost: 9.50, serviceName: "UPS Ground (1-2lb)" },
      { minWeightOz: 32.1, maxWeightOz: 48, cost: 10.80, serviceName: "UPS Ground (2-3lb)" },
      { minWeightOz: 48.1, maxWeightOz: 80, cost: 12.50, serviceName: "UPS Ground (3-5lb)" },
    ],
  },
];

export const COMMON_ITEMS = [
  { name: "T-Shirt (Adult)", weightOz: 7 },
  { name: "Jeans (Adult)", weightOz: 24 },
  { name: "Hoodie (Adult)", weightOz: 20 },
  { name: "Dress Shirt", weightOz: 9 },
  { name: "Light Jacket", weightOz: 16 },
  { name: "Sneakers (Pair)", weightOz: 32 },
  { name: "Boots (Pair)", weightOz: 48 },
  { name: "Video Game (Cased)", weightOz: 4 },
  { name: "Hardcover Book", weightOz: 24 },
  { name: "Paperback Book", weightOz: 12 },
];

export const SHIPPING_PRESETS = {
  eBay: [
    { name: "Ground Advantage (4oz)", maxOz: 4, cost: 4.15 },
    { name: "Ground Advantage (8oz)", maxOz: 8, cost: 4.90 },
    { name: "Ground Advantage (12oz)", maxOz: 12, cost: 5.60 },
    { name: "Ground Advantage (15.9oz)", maxOz: 15.9, cost: 6.80 },
    { name: "Priority Mail (1-2lb)", maxOz: 32, cost: 8.50 },
    { name: "Priority Mail (2-3lb)", maxOz: 48, cost: 12.50 },
    { name: "Priority Mail (3-4lb)", maxOz: 64, cost: 15.75 },
    { name: "Priority Mail (4-5lb)", maxOz: 80, cost: 19.20 },
  ],
  Poshmark: [
    { name: "Standard (5lb)", maxOz: 80, cost: 7.97 },
  ],
  Etsy: [
    { name: "First Class (4oz)", maxOz: 4, cost: 4.25 },
    { name: "First Class (8oz)", maxOz: 8, cost: 5.10 },
    { name: "First Class (12oz)", maxOz: 12, cost: 5.85 },
    { name: "First Class (1lb)", maxOz: 15.9, cost: 7.15 },
    { name: "Priority (2lb)", maxOz: 32, cost: 9.25 },
  ]
};
