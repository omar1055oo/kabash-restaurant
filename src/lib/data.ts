import dishChicken from "@/assets/dish-chicken.webp";
import dishMix from "@/assets/dish-mix.webp";
import dishMeat from "@/assets/dish-meat.webp";
import dishBox from "@/assets/dish-box.webp";

export const MENU_CATEGORIES = [
  {
    name: "أطباق الدجاج",
    items: [
      {
        id: "chicken-mandi",
        name: "مندي دجاج",
        desc: "1/4 دجاج + أرز + صوص دقوس",
        price: 160,
        img: dishChicken,
        sizes: [
          { name: "ربع دجاجة", price: 160 },
          { name: "نصف دجاجة", price: 210 },
          { name: "دجاجة كاملة", price: 400 },
        ],
      },
      {
        id: "chicken-big-box",
        name: "بيج بوكس دجاج",
        desc: "1/2 دجاج + أرز + صوص دقوس",
        price: 210,
        img: dishMix,
        sizes: [
          { name: "نصف دجاجة", price: 210 },
          { name: "دجاجة كاملة", price: 400 },
        ],
      },
    ],
  },
  {
    name: "أطباق اللحم",
    items: [
      {
        id: "meat-mandi",
        name: "مندي لحم",
        desc: "1/8 لحم + أرز + صوص دقوس",
        price: 160,
        img: dishMeat,
        sizes: [
          { name: "1/8 كيلو", price: 160 },
          { name: "1/4 كيلو", price: 260 },
          { name: "1/2 كيلو", price: 500 },
          { name: "كيلو", price: 950 },
        ],
      },
      {
        id: "meat-big-box",
        name: "بيج بوكس لحم",
        desc: "1/4 لحم + أرز + صوص دقوس",
        price: 260,
        img: dishBox,
        sizes: [
          { name: "1/4 كيلو", price: 260 },
          { name: "1/2 كيلو", price: 500 },
        ],
      },
    ],
  },
];

export function getProductById(id: string) {
  for (const cat of MENU_CATEGORIES) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}
