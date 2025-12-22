import {
  Sparkles,
  Droplets,
  Flower2,
  Snowflake,
  Heart,
  Smile,
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: any;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  image: string; // Placeholder string for now
}

export const CATEGORY_DATA: Category[] = [
  {
    id: "facial-care",
    name: "Facial Care",
    icon: Sparkles,
    subcategories: [
      {
        id: "cleanser",
        name: "Cleanser & Face Wash",
        image: "/images/cats/cleanser.png",
      },
      { id: "toner", name: "Toner & Mist", image: "/images/cats/toner.png" },
      { id: "serum", name: "Serum & Essence", image: "/images/cats/serum.png" },
      {
        id: "moisturizer",
        name: "Moisturizer & Cream",
        image: "/images/cats/cream.png",
      },
      {
        id: "sunscreen",
        name: "Sunscreen",
        image: "/images/cats/sunscreen.png",
      },
      { id: "mask", name: "Facial Mask", image: "/images/cats/mask.png" },
      { id: "eye-care", name: "Eye Care", image: "/images/cats/eye.png" },
      { id: "lip-care", name: "Lip Care", image: "/images/cats/lip.png" },
    ],
  },
  {
    id: "body-care",
    name: "Body Care",
    icon: Droplets,
    subcategories: [
      {
        id: "shower-gel",
        name: "Shower Gel & Wash",
        image: "/images/cats/shower.png",
      },
      {
        id: "body-lotion",
        name: "Body Lotion & Cream",
        image: "/images/cats/lotion.png",
      },
      {
        id: "body-scrub",
        name: "Body Scrub & Polish",
        image: "/images/cats/scrub.png",
      },
      { id: "soap", name: "Bar Soap", image: "/images/cats/soap.png" },
      { id: "deodorant", name: "Deodorant", image: "/images/cats/deo.png" },
      {
        id: "hand-foot",
        name: "Hand & Foot Care",
        image: "/images/cats/hand.png",
      },
    ],
  },
  {
    id: "hair-care",
    name: "Hair Care",
    icon: Snowflake, // Using Snowflake as placeholder for Hair if Scissors not available, or just keeping generic
    subcategories: [
      { id: "shampoo", name: "Shampoo", image: "/images/cats/shampoo.png" },
      {
        id: "conditioner",
        name: "Conditioner",
        image: "/images/cats/conditioner.png",
      },
      {
        id: "hair-treatment",
        name: "Hair Treatment & Mask",
        image: "/images/cats/hair-mask.png",
      },
      {
        id: "hair-oil",
        name: "Hair Oil & Serum",
        image: "/images/cats/hair-oil.png",
      },
      {
        id: "hair-color",
        name: "Hair Color",
        image: "/images/cats/hair-color.png",
      },
      {
        id: "styling",
        name: "Hair Styling",
        image: "/images/cats/styling.png",
      },
    ],
  },
  {
    id: "spa-wellness",
    name: "Spa & Wellness",
    icon: Flower2,
    subcategories: [
      {
        id: "massage-oil",
        name: "Massage Oil",
        image: "/images/cats/massage.png",
      },
      {
        id: "essential-oil",
        name: "Essential Oils",
        image: "/images/cats/oil.png",
      },
      {
        id: "herbal-compress",
        name: "Herbal Compress",
        image: "/images/cats/compress.png",
      },
      {
        id: "aroma",
        name: "Diffuser & Aroma",
        image: "/images/cats/diffuser.png",
      },
      { id: "balm", name: "Thai Herbal Balm", image: "/images/cats/balm.png" },
    ],
  },
  {
    id: "mom-baby",
    name: "Mom & Baby",
    icon: Heart,
    subcategories: [
      {
        id: "baby-wash",
        name: "Baby Wash & Shampoo",
        image: "/images/cats/baby-wash.png",
      },
      {
        id: "baby-lotion",
        name: "Baby Lotion",
        image: "/images/cats/baby-lotion.png",
      },
      {
        id: "mom-care",
        name: "Stretch Mark Cream",
        image: "/images/cats/stretch-mark.png",
      },
      { id: "baby-oil", name: "Baby Oil", image: "/images/cats/baby-oil.png" },
    ],
  },
  {
    id: "oral-care",
    name: "Oral Care",
    icon: Smile,
    subcategories: [
      {
        id: "toothpaste",
        name: "Herbal Toothpaste",
        image: "/images/cats/toothpaste.png",
      },
      {
        id: "mouthwash",
        name: "Mouthwash",
        image: "/images/cats/mouthwash.png",
      },
      {
        id: "breath-spray",
        name: "Breath Spray",
        image: "/images/cats/spray.png",
      },
    ],
  },
];
