export const dishes = [
  { id: "1", name: "Doro Wat", category: "Mains", price: 350, image: "/images/dishes/doro-wat.jpg",
    summary: "Slow-cooked chicken stew in spicy berbere sauce, served with a boiled egg and injera." },
  { id: "2", name: "Kitfo", category: "Mains", price: 420, image: "/images/dishes/kitfo.jpg",
    summary: "Finely minced beef seasoned with spiced butter and mitmita, served with ayib cheese." },
  { id: "3", name: "Shiro", category: "Vegetarian", price: 220, image: "/images/dishes/shiro.jpg",
    summary: "Creamy ground chickpea stew simmered with garlic and onion, a fasting-day favourite." },
  { id: "4", name: "Sambusa", category: "Starters", price: 90, image: "/images/dishes/sambusa.jpg",
    summary: "Crisp triangular pastries filled with spiced lentils or minced meat." },
  { id: "5", name: "Tibs", category: "Mains", price: 380, image: "/images/dishes/tibs.jpg",
    summary: "Sautéed cubes of beef with onion, rosemary and green chilli." },
  { id: "6", name: "Atkilt Wat", category: "Vegetarian", price: 200, image: "/images/dishes/atkilt-wat.jpg",
    summary: "Mild stew of cabbage, carrots and potatoes cooked with turmeric." },
  { id: "7", name: "Dulet", category: "Starters", price: 300, image: "/images/dishes/dulet.jpg",
    summary: "Minced tripe, liver and beef sautéed with butter, onion and chilli." },
  { id: "8", name: "Firfir", category: "Vegetarian", price: 180, image: "/images/dishes/firfir.jpg",
    summary: "Shredded injera tossed in spicy berbere sauce, a hearty breakfast dish." },
];

export async function getDishes() {
  return dishes;
}