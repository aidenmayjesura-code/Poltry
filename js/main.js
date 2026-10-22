// ========================================
// Fresh Feathers Farm - Main JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    renderFeaturedProducts();
    injectCartLink();
    updateCartCountUI();
});

// ----------------------------------------
// Mobile menu toggle
// ----------------------------------------

function initMobileMenu() {
    const menuToggle = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    menuToggle.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            menuToggle.click();
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ----------------------------------------
// Format price in Philippine pesos
// ----------------------------------------

function formatPrice(price) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(price);
}

// ----------------------------------------
// Render featured products from shared data
// ----------------------------------------

function renderFeaturedProducts() {
    const grid = document.getElementById("featured-grid");
    if (!grid || typeof products === "undefined") return;

    const featured = products.slice(0, 4);

    grid.innerHTML = featured
        .map(
            function (product) {
                const available = product.stock > 0;
                const fallbackImage =
                    "images/imagesrhode-island-red.jpg.png.png";

                return `
                <article class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${fallbackImage}';">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <span class="product-age">${product.age} Months Old</span>
                        <span class="product-price">${formatPrice(product.price)}</span>
                        <div class="product-actions">
                            <a href="product-details.html?id=${product.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </article>
            `;
            }
        )
        .join("");
}

// ----------------------------------------
// Cart link in navigation
// ----------------------------------------

function injectCartLink() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    // Avoid duplicating if already injected
    if (navLinks.querySelector("#cart-nav-item")) return;

    const cartItem = document.createElement("li");
    cartItem.id = "cart-nav-item";
    cartItem.innerHTML =
        '<a href="cart.html" id="cart-link" aria-label="Shopping cart">Cart <span id="cart-count" class="cart-count">0</span></a>';

    navLinks.appendChild(cartItem);
}

// ----------------------------------------
// Global Add to Cart handler (delegated)
// ----------------------------------------

document.addEventListener("click", function (event) {
    const btn = event.target.closest(".add-to-cart-btn");
    if (!btn) return;

    event.preventDefault();

    const productId = btn.dataset.id;
    const product = products.find(function (p) {
        return p.id === productId;
    });

    if (!product) return;

    addToCart(product);
    showCartToast(product.name);
});

// ----------------------------------------
// Simple form feedback (placeholder)
// ----------------------------------------

const contactForms = document.querySelectorAll("form");
contactForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Thank you for your message! We will get back to you soon.");
        form.reset();
    });
});

