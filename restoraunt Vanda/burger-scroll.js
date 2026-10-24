// ===== DISH MODAL =====
const dishModal = document.getElementById("dish-modal");
const modalImg = document.getElementById("modal-img");
const modalCat = document.getElementById("modal-cat");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalIngredients = document.getElementById("modal-ingredients");
const modalPrice = document.getElementById("modal-price");
const modalAddBtn = document.getElementById("modal-add-btn");
const modalClose = document.getElementById("dish-modal-close");

let currentDishId = null;

// Відкриття модалки при кліку на картку
document.addEventListener("click", function(e) {
  const card = e.target.closest(".dish");
  if (!card) return;
  
  // Ігноруємо клік по кнопці "Add to cart"
  if (e.target.closest("button")) return;

  const name = card.querySelector("h3")?.textContent || "";
  const desc = card.querySelector("p")?.textContent || "";
  const price = card.querySelector(".price")?.textContent || "";
  const cat = card.querySelector(".dish-cat")?.textContent || "";
  const img = card.querySelector("img")?.src || "";

  // Прості інгредієнти (можна потім розширити)
  const ingredientsMap = {
    "Noir Classic Burger": ["Brioche bun", "Dry-aged beef", "Aged cheddar", "Pickles", "House sauce", "Lettuce"],
    "Smoked Truffle Burger": ["Brioche bun", "Beef patty", "Truffle mayo", "Caramelised onion", "Smoked gouda", "Rocket"],
    "Crispy Chicken Burger": ["Brioche bun", "Crispy chicken", "Slaw", "Chilli honey", "Pickles"]
  };

  const ingredients = ingredientsMap[name] || ["Premium ingredients", "Freshly prepared", "Chef's special"];

  // Заповнюємо модалку
  modalImg.src = img;
  modalImg.alt = name;
  modalCat.textContent = cat;
  modalName.textContent = name;
  modalDesc.textContent = desc;
  modalPrice.textContent = price;
  
  modalIngredients.innerHTML = ingredients
    .map(ing => `<span>${ing}</span>`)
    .join("");

  // Знаходимо id страви для кнопки "Додати"
  const addBtn = card.querySelector("[data-add]");
  currentDishId = addBtn ? addBtn.dataset.add : null;

  // Відкриваємо
  dishModal.classList.add("open");
  document.body.style.overflow = "hidden";

  // Анімація інгредієнтів
  const spans = modalIngredients.querySelectorAll("span");
  spans.forEach((span, i) => {
    span.style.opacity = "0";
    span.style.transform = "translateY(12px)";
    setTimeout(() => {
      span.style.transition = "all 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)";
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    }, 180 + i * 70);
  });
});

// Закриття
function closeDishModal() {
  dishModal.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeDishModal);
dishModal.querySelector(".dish-modal-backdrop").addEventListener("click", closeDishModal);

// Кнопка "Додати до замовлення" в модалці
modalAddBtn.addEventListener("click", () => {
  if (currentDishId) {
    // Використовуємо існуючу логіку сайту
    const realBtn = document.querySelector(`[data-add="${currentDishId}"]`);
    if (realBtn) realBtn.click();
  }
  
  modalAddBtn.textContent = "Додано ✓";
  setTimeout(() => {
    modalAddBtn.textContent = "Додати до замовлення";
    closeDishModal();
  }, 700);
});
