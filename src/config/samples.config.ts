export interface SampleProduct {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  masterPublicId: string;
  defaultBrief: string;
  defaultCta: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'kaju-katli',
    name: "Haldiram's Royal Kaju Katli Sweets Box",
    category: "Festive Confectionery & Sweets",
    thumbnailUrl: "/images/kaju/master kaju katli.png",
    masterPublicId: "pixelpradesh_masters/kaju_katli_master",
    defaultBrief: "Festive celebration pack of artisanal silver-leaf Kaju Katli sweets. Premium gift packaging for family visits.",
    defaultCta: "Order Gift Box",
  },
  {
    id: 'tussar-kurta',
    name: "Fabindia Handwoven Festive Raw Silk Kurta",
    category: "Ethnic Apparel & Festive Wear",
    thumbnailUrl: "/images/kurta/master Silk Kurta.png",
    masterPublicId: "pixelpradesh_masters/tussar_kurta_master",
    defaultBrief: "Pure gold-spun Tussar silk festive kurta with subtle zari collar embroidery. Timeless elegance for auspicious gatherings.",
    defaultCta: "Shop Festive Look",
  },
  {
    id: 'assam-tea',
    name: "Makaibari Single-Estate Darjeeling & Assam Tea Tin",
    category: "Gourmet Beverages & Hampers",
    thumbnailUrl: "/images/tea/master Makaibari Single-Estate Darjeeling & Assam Tea Tin.png",
    masterPublicId: "pixelpradesh_masters/assam_tea_master",
    defaultBrief: "Single-estate autumn flush golden tea buds presented in an embossed brass-finished festive canister.",
    defaultCta: "Reserve Autumn Flush",
  },
];
