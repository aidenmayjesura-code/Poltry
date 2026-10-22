// ========================================
// Fresh Feathers Farm - Product Listings
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initProductPage();
});

function initProductPage() {
  const categoryButtons = document.querySelectorAll(".category-filter");
  const searchInput = document.getElementById("search-input");
  const productGrid = document.getElementById("product-grid");
  const noResults = document.getElementById("no-results");
  const resultCount = document.getElementById("result-count");

  if (!productGrid) return;

  let currentCategory = "all";
  let searchQuery = "";

  // Pre-select category from URL query (e.g. ?category=4-month)
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get("category");
  if (urlCategory) {
    currentCategory = urlCategory;
    highlightCategoryButton(currentCategory);
  }

  function ageCategory(age) {
    if (age >= 6) return "6-month";
    if (age === 5) return "5-month";
    return "4-month";
  }

  function isAvailable(product) {
    return product.stock > 0;
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  }

  function filterProducts() {
    return products.filter(function (product) {
      const matchCategory =
        currentCategory === "all" || ageCategory(product.age) === currentCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(q) ||
        product.breed.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }

  function highlightCategoryButton(category) {
    categoryButtons.forEach(function (btn) {
      if (btn.dataset.category === category) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function renderProducts() {
    const filtered = filterProducts();
    productGrid.innerHTML = "";

    if (resultCount) {
      resultCount.textContent = filtered.length + " chicken" + (filtered.length !== 1 ? "s" : "") + " found";
    }

    if (filtered.length === 0) {
      if (noResults) noResults.style.display = "block";
      return;
    }

    if (noResults) noResults.style.display = "none";

    filtered.forEach(function (product) {
      productGrid.insertAdjacentHTML("beforeend", createProductCard(product));
    });
  }

  function createProductCard(product) {
    const available = isAvailable(product);
    const statusText = available ? "In Stock" : "Out of Stock";
    const statusClass = available ? "status-in-stock" : "status-out-of-stock";
    const detailUrl = "product-details.html?id=" + product.id;
    const fallbackImage =
      "images/imagesrhode-island-red.jpg.png.png";

    return `
      <article class="product-card" data-category="${ageCategory(product.age)}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${fallbackImage}';">
          <span class="product-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span class="product-breed">${product.breed}</span>
            <span class="product-age">${product.age} Months Old</span>
          </div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(product.price)}</span>
            <div class="product-actions">
              <button type="button" class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
              <a href="${detailUrl}" class="btn btn-outline">View Details</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  categoryButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentCategory = btn.dataset.category;
      highlightCategoryButton(currentCategory);
      renderProducts();
    });
  });

  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value;
    renderProducts();
  });

  renderProducts();
}

