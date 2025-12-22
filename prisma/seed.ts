import { PrismaClient } from "@prisma/client";
import { CATEGORY_DATA } from "../src/lib/categories";
import { PRODUCT_DATA } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // 1. Clean up existing data (optional, but good for idempotency)
  // 1. Clean up existing data (optional, but good for idempotency)
  await prisma.banner.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  // 2. Seed Categories
  console.log("Seeding Categories...");
  // ... (Keep existing category seeding logic)

  for (const cat of CATEGORY_DATA) {
    // Create Parent Category
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.id, // Using ID as slug for simplicity
        icon: "icon-placeholder", // We can't store the function, just a placeholder
      },
    });

    // Create Subcategories
    for (const sub of cat.subcategories) {
      await prisma.category.create({
        data: {
          id: sub.id,
          name: sub.name,
          slug: sub.id,
          image: sub.image,
          parentId: cat.id,
        },
      });
    }
  }

  // 3. Seed Brands
  console.log("Seeding Brands...");
  const uniqueSuppliers = Array.from(
    new Set(PRODUCT_DATA.map((p) => p.supplier))
  );
  const brandMap = new Map<string, string>(); // Name -> ID

  for (const supplierName of uniqueSuppliers) {
    const brand = await prisma.brand.create({
      data: {
        name: supplierName,
        slug: supplierName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        verified: true,
        description: `Official store for ${supplierName}`,
      },
    });
    brandMap.set(supplierName, brand.id);
  }

  // 4. Seed Products
  console.log("Seeding Products...");
  for (const product of PRODUCT_DATA) {
    const priceDecimal = parseFloat(product.price.replace("$", ""));

    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        supplier: product.supplier,
        minOrder: product.minOrder,
        price: priceDecimal,
        categoryId: product.subCategoryId, // Link to subcategory
        brandId: brandMap.get(product.supplier),
        images: product.image ? [product.image] : [],
      },
    });
  }

  // 4. Seed Banners
  console.log("Seeding Banners...");
  // Specific images for each sub-category
  const bannerMap: Record<string, string[]> = {
    // Facial Care
    cleanser: [
      "https://images.unsplash.com/photo-1556228578-8d844fb22295?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-1987ba494bb5?q=80&w=1000&auto=format&fit=crop",
    ],
    toner: [
      "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    ],
    serum: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1000&auto=format&fit=crop",
    ],
    moisturizer: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=1000&auto=format&fit=crop",
    ],
    sunscreen: [
      "https://images.unsplash.com/photo-1551651767-d5dd4e7240c0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1000&auto=format&fit=crop",
    ],
    mask: [
      "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000&auto=format&fit=crop",
    ],

    // Body Care
    "shower-gel": [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop",
    ],
    "body-lotion": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=1000&auto=format&fit=crop",
    ],
    "hand-foot": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
    ],

    // Hair Care
    shampoo: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop",
    ],
    conditioner: [
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=1000&auto=format&fit=crop",
    ],
    "hair-oil": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    ],

    // Spa
    "massage-oil": [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    ],
    aroma: [
      "https://images.unsplash.com/photo-1602143407151-01114192003b?q=80&w=1000&auto=format&fit=crop",
    ],

    // Default fallback
    default: [
      "https://images.unsplash.com/photo-1556228578-8d844fb22295?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000&auto=format&fit=crop",
    ],
  };

  for (const cat of CATEGORY_DATA) {
    for (const sub of cat.subcategories) {
      // Use specific images or default
      const images = bannerMap[sub.id] || bannerMap.default;

      // Create 2-3 banners per subcategory using the mapped images
      for (let i = 0; i < 3; i++) {
        // Cycle through the assigned images
        const imageUrl = images[i % images.length];

        await prisma.banner.create({
          data: {
            title: `Special Offer for ${sub.name}`,
            image: imageUrl,
            subCategoryId: sub.id,
            link: "#",
          },
        });
      }
    }
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
