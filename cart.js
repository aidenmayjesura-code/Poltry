// ========================================
// Fresh Feathers Farm - Shopping Cart
// ========================================

const CART_STORAGE_KEY = "fresh_feathers_cart";

let cart = [];

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      cart = JSON.parse(stored);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    // ignore quota errors
  }
}

function addToCart(product) {
  const existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();
  updateCartCountUI();
  return cart;
}

function updateQuantity(id, quantity) {
  const item = cart.find(function (i) {
    return i.id === id;
  });
  if (!item) return cart;

  if (quantity < 1) {
    quantity = 1;
  }

  item.quantity = quantity;
  saveCart();
  updateCartCountUI();
  return cart;
}

function removeItem(id) {
  cart = cart.filter(function (i) {
    return i.id !== id;
  });
  saveCart();
  updateCartCountUI();
  return cart;
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCountUI();
  return cart;
}

function getCartTotal() {
  return cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
}

function getCart() {
  return cart;
}

function getCartCount() {
  return cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
}

function updateCartCountUI() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = getCartCount();
  }
}

function showCartToast(productName) {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = productName + " added to cart.";
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

loadCart();
