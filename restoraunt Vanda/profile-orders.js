(function () {
  "use strict";

  const PROFILE_KEY = "noir_profile";
  const ORDERS_KEY = "noir_orders";
  const profileDrawer = document.getElementById("profileDrawer");
  const profileOverlay = document.getElementById("profileOverlay");
  const closeProfileBtn = document.getElementById("closeProfileBtn");
  const profileFormWrap = document.getElementById("profileFormWrap");
  const ordersListWrap = document.getElementById("ordersListWrap");
  const userOrdersList = document.getElementById("userOrdersList");
  const noOrders = document.getElementById("noOrders");
  const openProfileBtn = document.getElementById("openProfileBtn");

  function readLocal(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function getProfile() {
    const profile = readLocal(PROFILE_KEY, {});
    return profile && typeof profile === "object" ? profile : {};
  }

  function getOrders() {
    const orders = readLocal(ORDERS_KEY, []);
    return Array.isArray(orders) ? orders : [];
  }

  function renderProfile() {
    const profile = getProfile();
    const orders = getOrders();

    if (!profile.name) {
      profileFormWrap.hidden = false;
      ordersListWrap.hidden = true;
      return;
    }

    profileFormWrap.hidden = true;
    ordersListWrap.hidden = false;
    document.getElementById("profileNameDisplay").textContent = profile.name;
    document.getElementById("profilePhoneDisplay").textContent = profile.phone || "";

    const myOrders = orders.filter(order => order.phone === profile.phone);
    noOrders.hidden = myOrders.length > 0;
    userOrdersList.innerHTML = myOrders.map(order => {
      const orderDate = new Date(order.date);
      const dateText = Number.isNaN(orderDate.getTime()) ? "" : orderDate.toLocaleString();
      const status = order.status || "new";
      const statusClass = {
        new: "status-new",
        preparing: "status-preparing",
        delivered: "status-delivered",
        cancelled: "status-cancelled"
      }[status] || "status-new";
      const items = Array.isArray(order.items) ? order.items : [];
      const itemsHtml = items.map(item => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        return `<li><span>${qty} × ${escapeHtml(item.name)}</span><span>€${(price * qty).toFixed(2)}</span></li>`;
      }).join("");
      const total = Number(order.total) || 0;

      return `<div class="user-order-card">
        <header>
          <strong>${escapeHtml(order.id)}</strong>
          <span class="status-badge ${statusClass}">${escapeHtml(status)}</span>
        </header>
        <div class="order-date">${escapeHtml(dateText)}</div>
        <ul>${itemsHtml}</ul>
        <div class="order-total">Total: €${total.toFixed(2)}</div>
      </div>`;
    }).join("");
  }

  function openProfile() {
    renderProfile();
    profileDrawer.classList.add("open");
    profileOverlay.classList.add("show");
    profileDrawer.setAttribute("aria-hidden", "false");
    closeProfileBtn.focus();
  }

  function closeProfile() {
    profileDrawer.classList.remove("open");
    profileOverlay.classList.remove("show");
    profileDrawer.setAttribute("aria-hidden", "true");
  }

  openProfileBtn.addEventListener("click", openProfile);
  closeProfileBtn.addEventListener("click", closeProfile);
  profileOverlay.addEventListener("click", closeProfile);

  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    const name = document.getElementById("profName").value.trim();
    const phone = document.getElementById("profPhone").value.trim();
    const nameError = document.getElementById("profNameErr");
    const phoneError = document.getElementById("profPhoneErr");

    nameError.textContent = "";
    phoneError.textContent = "";
    if (name.length < 2) nameError.textContent = "Enter your full name";
    if (phone.replace(/\D/g, "").length < 7) phoneError.textContent = "Enter a valid phone number";
    if (nameError.textContent || phoneError.textContent) return;

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, phone }));
      renderProfile();
    } catch {
      phoneError.textContent = "Could not save your profile in this browser";
    }
  });

  document.getElementById("editProfileBtn").addEventListener("click", () => {
    const profile = getProfile();
    document.getElementById("profName").value = profile.name || "";
    document.getElementById("profPhone").value = profile.phone || "";
    profileFormWrap.hidden = false;
    ordersListWrap.hidden = true;
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && profileDrawer.classList.contains("open")) closeProfile();
  });
})();
