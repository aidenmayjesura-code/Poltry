// ========================================
// Fresh Feathers Farm - Admin Dashboard
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  if (typeof loadProducts === "function") {
    loadProducts();
  }
  initAdmin();
});

function initAdmin() {
  const addForm = document.getElementById("add-chicken-form");
  const editForm = document.getElementById("edit-chicken-form");
  const cancelAdd = document.getElementById("cancel-add");
  const cancelEdit = document.getElementById("cancel-edit");
  const tableBody = document.getElementById("admin-table-body");

  renderStats();
  renderTable();

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleAdd();
  });

  cancelAdd.addEventListener("click", function () {
    addForm.reset();
    const addPreviewContainer = document.querySelector(".add-image-preview");
    const addImagePreview = document.getElementById("add-image-preview");
    if (addPreviewContainer) addPreviewContainer.style.display = "none";
    if (addImagePreview) addImagePreview.src = "";
  });

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleEdit();
  });

  cancelEdit.addEventListener("click", cancelEditMode);

  // Reset to sample data
  const resetBtn = document.getElementById("reset-data-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (confirm("This will clear all custom changes and restore the sample chicken data. Continue?")) {
        localStorage.removeItem(STORAGE_KEY);
        loadProducts();
        renderStats();
        renderTable();
        showMessage("Data reset to sample products.", "success");
      }
    });
  }

  tableBody.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");
    if (editBtn) {
      enterEditMode(editBtn.dataset.id);
    } else if (deleteBtn) {
      handleDelete(deleteBtn.dataset.id);
    }
  });

  // Image preview for add form
  const addImageInput = document.getElementById("add-image");
  const addImagePreview = document.getElementById("add-image-preview");
  const addPreviewContainer = document.querySelector(".add-image-preview");
  if (addImageInput && addImagePreview && addPreviewContainer) {
    addImageInput.addEventListener("input", function () {
      const url = this.value.trim();
      if (url) {
        addImagePreview.src = url;
        addImagePreview.alt = "Preview";
        addPreviewContainer.style.display = "block";
        addImagePreview.onerror = function () {
          this.onerror = null;
          this.style.display = "none";
        };
      } else {
        addPreviewContainer.style.display = "none";
      }
    });
  }

  // Image preview for edit form
  const editImageInput = document.getElementById("edit-image");
  const editImagePreview = document.getElementById("edit-image-preview");
  const editPreviewContainer = document.querySelector(".edit-image-preview");
  if (editImageInput && editImagePreview && editPreviewContainer) {
    editImageInput.addEventListener("input", function () {
      const url = this.value.trim();
      if (url) {
        editImagePreview.src = url;
        editImagePreview.alt = "Preview";
        editPreviewContainer.style.display = "block";
      editImagePreview.onerror = function () {
        this.onerror = null;
        this.style.display = "none";
      };
      } else {
        editPreviewContainer.style.display = "none";
      }
    });
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
}

function ageCategory(age) {
  if (age >= 6) return "6-month";
  if (age === 5) return "5-month";
  return "4-month";
}

function generateProductId() {
  let max = 0;
  products.forEach(function (p) {
    const match = String(p.id).match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  });
  return "chicken-" + String(max + 1).padStart(3, "0");
}

function showMessage(text, type) {
  const el = document.getElementById("admin-message");
  if (!el) return;
  el.textContent = text;
  el.className = "admin-message " + type;
  el.style.display = "block";
  setTimeout(function () {
    el.style.display = "none";
  }, 4000);
}

function renderStats() {
  const total = products.length;
  const totalStock = products.reduce(function (sum, p) {
    return sum + (p.stock || 0);
  }, 0);
  const available = products.filter(function (p) {
    return (p.stock || 0) > 0;
  }).length;
  const outOfStock = products.filter(function (p) {
    return (p.stock || 0) === 0;
  }).length;

  setStat("stat-total", total);
  setStat("stat-stock", totalStock);
  setStat("stat-available", available);
  setStat("stat-out-of-stock", outOfStock);
}

function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderTable() {
  const tbody = document.getElementById("admin-table-body");
  const emptyEl = document.getElementById("admin-empty-table");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (products.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";

  products.forEach(function (p) {
    const inStock = (p.stock || 0) > 0;
    const statusText = inStock ? "Available" : "Out of Stock";
    const statusClass = inStock ? "status-in-stock" : "status-out-of-stock";
    const fallbackImage = "images/imagesrhode-island-red.jpg.png.png";

    const row =
      '<tr>' +
      '<td><img src="' +
      escapeHtml(p.image) +
      '" alt="' +
      escapeHtml(p.name) +
      '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" onerror="this.onerror=null;this.src=\'' +
      fallbackImage +
      "';"></td>" +
      '<td>' +
      escapeHtml(p.name) +
      "</td>" +
      '<td>' +
      escapeHtml(p.breed) +
      "</td>" +
      '<td>' +
      p.age +
      " months</td>" +
      '<td>' +
      formatPrice(p.price) +
      "</td>" +
      '<td>' +
      (p.stock || 0) +
      "</td>" +
      '<td><span class="status-badge ' +
      statusClass +
      '">' +
      statusText +
      "</span></td>" +
      '<td>' +
      '<button type="button" class="btn btn-outline btn-sm edit-btn" data-id="' +
      escapeHtml(p.id) +
      '">Edit</button> ' +
      '<button type="button" class="btn btn-sm delete-btn" data-id="' +
      escapeHtml(p.id) +
      '">Delete</button>' +
      "</td>" +
      "</tr>";

    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function getFormValues(formId) {
  const prefix = formId === "add-chicken-form" ? "add-" : "edit-";
  const get = function (field) {
    const el = document.getElementById(prefix + field);
    return el ? el.value : "";
  };

  const values = {
    name: get("name"),
    breed: get("breed"),
    age: get("age"),
    price: get("price"),
    description: get("description"),
    image: get("image"),
    sex: get("sex"),
    weight: get("weight"),
    stock: get("stock"),
  };
  return values;
}

function validateChicken(values) {
  if (!values.name || !values.name.trim()) {
    return "Product name is required.";
  }
  if (!values.breed || !values.breed.trim()) {
    return "Breed is required.";
  }
  const age = parseInt(values.age, 10);
  if (isNaN(age) || age < 1) {
    return "Age must be a valid positive number of months.";
  }
  const price = parseFloat(values.price);
  if (isNaN(price) || price < 0) {
    return "Price must be zero or greater.";
  }
  if (!values.description || !values.description.trim()) {
    return "Description is required.";
  }
  if (!values.image || !values.image.trim()) {
    return "Image URL is required.";
  }
  const stock = parseInt(values.stock, 10);
  if (isNaN(stock) || stock < 0) {
    return "Stock quantity must be zero or greater.";
  }
  return null;
}

function handleAdd() {
  const values = getFormValues("add-chicken-form");
  if (!values) {
    showMessage("Could not read the add form.", "error");
    return;
  }

  const error = validateChicken(values);
  if (error) {
    showMessage(error, "error");
    return;
  }

  const newProduct = {
    id: generateProductId(),
    name: values.name.trim(),
    breed: values.breed.trim(),
    age: parseInt(values.age, 10),
    price: parseFloat(values.price),
    description: values.description.trim(),
    image: values.image.trim(),
    stock: parseInt(values.stock, 10),
  };

  if (values.sex && values.sex.trim()) newProduct.sex = values.sex.trim();
  if (values.weight && values.weight.trim()) newProduct.weight = values.weight.trim();

  products.push(newProduct);
  saveProducts();
  renderStats();
  renderTable();
  document.getElementById("add-chicken-form").reset();
  showMessage("Chicken added successfully.", "success");
}

function enterEditMode(id) {
  const product = products.find(function (p) {
    return p.id === id;
  });
  if (!product) {
    showMessage("Product not found.", "error");
    return;
  }

  document.getElementById("edit-product-id").value = product.id;
  document.getElementById("edit-name").value = product.name;
  document.getElementById("edit-breed").value = product.breed;
  document.getElementById("edit-age").value = product.age;
  document.getElementById("edit-price").value = product.price;
  document.getElementById("edit-description").value = product.description;
  document.getElementById("edit-image").value = product.image;
  document.getElementById("edit-sex").value = product.sex || "";
  document.getElementById("edit-weight").value = product.weight || "";
  document.getElementById("edit-stock").value = product.stock;

  // Show image preview in edit form
  const editImagePreview = document.getElementById("edit-image-preview");
  const editPreviewContainer = document.querySelector(".edit-image-preview");
  if (editImagePreview && editPreviewContainer && product.image) {
    editImagePreview.src = product.image;
    editImagePreview.alt = "Preview of " + product.name;
    editPreviewContainer.style.display = "block";
    editImagePreview.onerror = function () {
      this.onerror = null;
      this.style.display = "none";
    };
  }

  document.getElementById("add-form-section").style.display = "none";
  document.getElementById("edit-form-section").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEditMode() {
  document.getElementById("edit-chicken-form").reset();
  const editPreviewContainer = document.querySelector(".edit-image-preview");
  const editImagePreview = document.getElementById("edit-image-preview");
  if (editPreviewContainer) editPreviewContainer.style.display = "none";
  if (editImagePreview) editImagePreview.src = "";
  document.getElementById("edit-form-section").style.display = "none";
  document.getElementById("add-form-section").style.display = "block";
}

function handleEdit() {
  const id = document.getElementById("edit-product-id").value;
  const values = getFormValues("edit-chicken-form");
  if (!values) {
    showMessage("Could not read the edit form.", "error");
    return;
  }

  const error = validateChicken(values);
  if (error) {
    showMessage(error, "error");
    return;
  }

  const index = products.findIndex(function (p) {
    return p.id === id;
  });
  if (index === -1) {
    showMessage("Product not found.", "error");
    return;
  }

  products[index] = {
    id: id,
    name: values.name.trim(),
    breed: values.breed.trim(),
    age: parseInt(values.age, 10),
    price: parseFloat(values.price),
    description: values.description.trim(),
    image: values.image.trim(),
    stock: parseInt(values.stock, 10),
    sex: values.sex && values.sex.trim() ? values.sex.trim() : products[index].sex,
    weight:
      values.weight && values.weight.trim() ? values.weight.trim() : products[index].weight,
  };

  saveProducts();
  renderStats();
  renderTable();
  cancelEditMode();
  showMessage("Chicken updated successfully.", "success");
}

function handleDelete(id) {
  if (!confirm("Are you sure you want to delete this chicken?")) {
    return;
  }

  const index = products.findIndex(function (p) {
    return p.id === id;
  });
  if (index === -1) {
    showMessage("Product not found.", "error");
    return;
  }

  products.splice(index, 1);
  saveProducts();
  renderStats();
  renderTable();
  showMessage("Chicken deleted successfully.", "success");
}

