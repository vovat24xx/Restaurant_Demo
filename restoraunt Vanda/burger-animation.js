const burgersData = {
  classic: {
    name: "Noir Classic Burger",
    desc: "Dry-aged beef patty, aged cheddar, pickles, house sauce, brioche bun.",
    price: "€14.50",
    ingredients: ["Brioche bun", "Dry-aged beef 150g", "Aged cheddar", "Pickles", "House sauce", "Lettuce"]
  },
  truffle: {
    name: "Smoked Truffle Burger",
    desc: "Beef patty, truffle mayo, caramelised onion, smoked gouda, rocket.",
    price: "€17.90",
    ingredients: ["Brioche bun", "Beef patty", "Truffle mayo", "Caramelised onion", "Smoked gouda", "Rocket"]
  }
};

const modal = document.getElementById("burger-modal");
const burger = document.getElementById("interactive-burger");
const closeBtn = document.getElementById("close-burger-modal");

// Клік по картках
document.querySelectorAll(".menu-card, .dish-card, [data-burger]").forEach(card => {
  card.style.cursor = "pointer";
  card.addEventListener("click", (e) => {
    if (e.target.closest("button")) return; // ігноруємо кнопку Add to cart

    // Визначаємо який бургер
    let id = card.dataset.burger;
    if (!id) {
      const title = card.querySelector("h3, h4, .dish-title, .card-title");
      if (title && title.textContent.includes("Truffle")) id = "truffle";
      else id = "classic";
    }
    openBurgerModal(id);
  });
});

function openBurgerModal(id) {
  const data = burgersData[id] || burgersData.classic;

  document.getElementById("burger-name").textContent = data.name;
  document.getElementById("burger-desc").textContent = data.desc;
  document.getElementById("burger-price").textContent = data.price;

  document.getElementById("burger-ingredients").innerHTML = data.ingredients
    .map(item => `<span class="ing-tag">${item}</span>`).join("");

  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  resetAndAssemble();
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);
modal.querySelector(".burger-modal-backdrop").addEventListener("click", closeModal);

// Анімація збірки
function resetAndAssemble() {
  const layers = burger.querySelectorAll(".layer");
  layers.forEach((layer, i) => {
    layer.style.transition = "none";
    layer.style.opacity = "0";
    layer.style.transform = `translateX(-50%) translateY(${-100 - i * 25}px) scale(0.7)`;
  });

  requestAnimationFrame(() => {
    layers.forEach((layer, i) => {
      setTimeout(() => {
        layer.style.transition = "all 0.65s cubic-bezier(0.34, 1.4, 0.64, 1)";
        layer.style.opacity = "1";
        layer.style.transform = "translateX(-50%) translateY(0) scale(1)";
      }, i * 140);
    });
  });
}

// 3D нахил від миші
const visual = document.querySelector(".burger-visual");
let rotateX = -20;
let rotateY = 18;

visual.addEventListener("mousemove", (e) => {
  const rect = visual.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  rotateY = (x - 0.5) * 55;
  rotateX = -20 + (y - 0.5) * 35;

  burger.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Кнопка додати
document.getElementById("add-burger-to-cart").addEventListener("click", () => {
  const btn = document.getElementById("add-burger-to-cart");
  btn.textContent = "Додано ✓";
  btn.style.background = "#4caf50";
  setTimeout(() => {
    btn.textContent = "Додати до замовлення";
    btn.style.background = "";
    closeModal();
  }, 800);
});