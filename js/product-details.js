// ========================================
// Fresh Feathers Farm - Product Details
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initProductDetails();
});

function initProductDetails() {
  const notFoundEl = document.getElementById("product-not-found");
  const contentEl = document.getElementById("product-content");

  if (!notFoundEl || !contentEl) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    showNotFound();
    return;
  }

  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) {
    showNotFound();
    return;
  }

  renderProduct(product);
}

function showNotFound() {
  const notFoundEl = document.getElementById("product-not-found");
  const contentEl = document.getElementById("product-content");
  notFoundEl.style.display = "block";
  contentEl.style.display = "none";
}

function renderProduct(product) {
  const notFoundEl = document.getElementById("product-not-found");
  const contentEl = document.getElementById("product-content");

  notFoundEl.style.display = "none";
  contentEl.style.display = "block";

  document.title = product.name + " | Fresh Feathers Farm";
  document.getElementById("detail-name").textContent = product.name;
  document.getElementById("detail-breed").textContent = product.breed;
  document.getElementById("detail-age").textContent = product.age + " Months Old";
  document.getElementById("detail-sex").textContent = product.sex || "Not specified";
  document.getElementById("detail-description").textContent = product.description;
  document.getElementById("detail-price").textContent = formatPrice(product.price);
  document.getElementById("detail-weight").textContent = product.weight || "Not specified";
  document.getElementById("detail-purpose").textContent = product.purpose || "Not specified";

  const availabilityEl = document.getElementById("detail-availability");
  const stockEl = document.getElementById("detail-stock");
  const inStock = product.stock > 0;

  availabilityEl.textContent = inStock ? "In Stock" : "Out of Stock";
  availabilityEl.className = "spec-value availability " + (inStock ? "in-stock" : "out-of-stock");
  stockEl.textContent = product.stock + (product.stock === 1 ? " chicken" : " chickens");

  const imgEl = document.getElementById("detail-image");
  const fallbackImage = "images/imagesrhode-island-red.jpg.png.png";
  imgEl.src = product.image;
  imgEl.alt = product.name;
  imgEl.onerror = function () {
    this.onerror = null;
    this.src = fallbackImage;
  };

  const detailActions = document.getElementById("detail-actions");
  if (detailActions) {
    detailActions.innerHTML =
      '<button type="button" class="btn btn-primary add-to-cart-btn" data-id="' +
      product.id +
      '">Add to Cart</button>';
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
}

