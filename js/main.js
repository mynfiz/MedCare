// JavaScript umum MediCare: navigasi mobile, tahun footer, dan jumlah keranjang.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const currentYear = document.getElementById("currentYear");
  const cartCount = document.getElementById("cartCount");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';

      if (window.lucide) window.lucide.createIcons();
    });

    // Tutup menu setelah salah satu tautan dipilih.
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }

  // Jumlah keranjang dibaca dari LocalStorage jika datanya sudah tersedia.
  try {
    const cart = JSON.parse(localStorage.getItem("medicare_cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    if (cartCount) cartCount.textContent = totalItems;
  } catch (error) {
    console.warn("Data keranjang tidak dapat dibaca:", error);
    if (cartCount) cartCount.textContent = "0";
  }

  if (window.lucide) window.lucide.createIcons();
});
