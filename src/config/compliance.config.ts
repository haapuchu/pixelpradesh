export interface ComplianceRule {
  id: 'LOGO_VISIBILITY' | 'TEXT_CLIPPING' | 'PRODUCT_DISTORTION' | 'BRAND_SAFETY';
  name: string;
  description: string;
  thresholdScore: number;
}

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'PRODUCT_DISTORTION',
    name: 'Product Geometry Preservation',
    description: 'Verifies the physical product pixels remain un-distorted and authentic across generative outpainting.',
    thresholdScore: 0.90,
  },
  {
    id: 'LOGO_VISIBILITY',
    name: 'Logo & Emblem Contrast',
    description: 'Ensures the product branding, logo, and labels maintain high contrast against festive background elements.',
    thresholdScore: 0.85,
  },
  {
    id: 'TEXT_CLIPPING',
    name: 'Channel Safe-Zone Boundary',
    description: 'Guarantees localized Indic headline and CTA overlays remain completely inside platform-safe viewports.',
    thresholdScore: 0.88,
  },
  {
    id: 'BRAND_SAFETY',
    name: 'Cultural Sensitivity & Safety',
    description: 'Verifies the visual elements and regional copy adhere to cultural decorum for the designated celebration.',
    thresholdScore: 0.95,
  },
];
