// Дані про бургери (підстав свої)
const burgers = {
  classic: {
    name: "Classic Burger",
    desc: "Соковита яловича котлета, сир чеддер, свіжі овочі та фірмовий соус",
    price: "₴ 189",
    ingredients: ["Булочка бріош", "Яловича котлета 150г", "Сир чеддер", "Салат айсберг", "Помідор", "Соус NOIR"]
  },
  // додай інші...
};

const modal = document.getElementById("burger-modal");
const burgerEl = document.getElementById("interactive-burger");
const closeBtn = document.getElementById("close-burger-modal");

// Відкриття модалки при кліку на картку
document.querySelectorAll(".menu-card").forEach(card => {
  card.addEventListener("click", () => {
    const id = card.dataset.burger || "classic";
    openBurger(id);
  });
});

function openBurger(id) {
  const data = burgers[id] || burgers.classic;

  document.getElementById("burger-name").textContent = data.name;
  document.getElementById("burger-desc").textContent = data.desc;
  document.getElementById("burger-price").textContent = data.price;

  const ingredientsEl = document.getElementById("burger-ingredients");
  ingredientsEl.innerHTML = data.ingredients
    .map(ing => `<span class="ing">${ing}</span>`)
    .join("");

  modal.classList.add("open");
  animateBurgerAssembly();
}

// Закриття
closeBtn.addEventListener("click", () => modal.classList.remove("open"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("open");
});

// ===== Анімація збірки =====
function animateBurgerAssembly() {
  const layers = burgerEl.querySelectorAll(".layer");
  layers.forEach((layer, i) => {
    layer.style.opacity = "0";
    layer.style.transform = `translateY(${-80 - i * 20}px) scale(0.8)`;
  });

  layers.forEach((layer, i) => {
    setTimeout(() => {
      layer.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
      layer.style.opacity = "1";
      layer.style.transform = "translateY(0) scale(1)";
    }, i * 180);
  });
}

// ===== 3D поворот від миші / пальця =====
let isDragging = false;
let startX = 0, startY = 0;
let currentRotateX = -12, currentRotateY = 15;

burgerEl.addEventListener("mousedown", startDrag);
burgerEl.addEventListener("touchstart", startDrag, { passive: false });

function startDrag(e) {
  isDragging = true;
  const point = e.touches ? e.touches[0] : e;
  startX = point.clientX;
  startY = point.clientY;
  e.preventDefault();
}

window.addEventListener("mousemove", drag);
window.addEventListener("touchmove", drag, { passive: false });

function drag(e) {
  if (!isDragging) return;
  const point = e.touches ? e.touches[0] : e;
  const deltaX = point.clientX - startX;
  const deltaY = point.clientY - startY;

  currentRotateY += deltaX * 0.3;
  currentRotateX -= deltaY * 0.3;
  currentRotateX = Math.max(-35, Math.min(15, currentRotateX));

  burgerEl.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
  startX = point.clientX;
  startY = point.clientY;
}

window.addEventListener("mouseup", () => isDragging = false);
window.addEventListener("touchend", () => isDragging = false);

// Кнопка "Додати"
document.getElementById("add-burger-to-cart").addEventListener("click", () => {
  // Тут твоя логіка кошика
  alert("Додано до замовлення!");
  modal.classList.remove("open");
});