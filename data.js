// ========================================
// Fresh Feathers Farm - Sample Product Data
// ========================================
// NOTE: All prices, stock quantities, and product details below are
// SAMPLE DATA for demonstration purposes only.

const STORAGE_KEY = "fresh_feathers_products";
const STORAGE_VERSION = "3";

const IMAGE_PATHS = {
  "images/rhode-island-red.jpg.png": "images/imagesrhode-island-red.jpg.png.png",
  "images/leghorn.jpg.png": "images/imagesleghorn.jpg.png.png",
  "images/plymouth-rock.jpg.png": "images/imagesplymouth-rock.jpg.png.png",
  "images/buff-orpington.jpg.png": "images/buff-orpington.jpg.png.png",
  "images/native-chicken.jpg.png": "images/imagesnative-chicken.jpg.png.png",
  "images/broiler.jpg.png": "images/broiler.jpg.png.png",
  "images/australorp.jpg.png": "images/australorp.jpg.png.png",
};

function fixImagePath(image) {
  if (!image) return image;
  const mapped = IMAGE_PATHS[image];
  return typeof mapped === "string" && mapped ? mapped : image;
}

const seedProducts = [
  {
    id: "chicken-001",
    name: "Rhode Island Red Pullet",
    breed: "Rhode Island Red",
    age: 4,
    price: 350,
    description:
      "A hardy, friendly pullet known for consistent brown egg production. Ideal for backyard flocks and beginner chicken keepers.",
     image:
        "images/imagesrhode-island-red.jpg.png.png",
      stock: 12,

    sex: "Female",
    weight: "1.8 kg",
    purpose: "Egg production",
  },
  {
    id: "chicken-002",
    name: "Leghorn Layer Hen",
    breed: "Leghorn",
    age: 5,
    price: 420,
    description:
      "An active white egg layer that starts producing early. Great for small farms focused on egg supply.",
     image:
        "images/imagesleghorn.jpg.png.png",
      stock: 8,

    sex: "Female",
    weight: "1.6 kg",
    purpose: "White egg production",
  },
  {
    id: "chicken-003",
    name: "Plymouth Rock Hen",
    breed: "Plymouth Rock",
    age: 6,
    price: 480,
    description:
      "A mature dual-purpose hen in full laying production. Calm temperament and reliable brown eggs.",
     image:
        "images/imagesplymouth-rock.jpg.png.png",
      stock: 15,

    sex: "Female",
    weight: "2.2 kg",
    purpose: "Dual-purpose (eggs and meat)",
  },
  {
    id: "chicken-004",
    name: "Buff Orpington Pullet",
    breed: "Buff Orpington",
    age: 4,
    price: 380,
    description:
      "A fluffy, docile pullet that grows into a dependable layer and cold-hardy backyard chicken.",
    image:
      "images/buff-orpington.jpg.png.png",
    stock: 5,
    sex: "Female",
    weight: "2.0 kg",
    purpose: "Egg production and show",
  },
  {
    id: "chicken-005",
    name: "Native Chicken",
    breed: "Native",
    age: 6,
    price: 320,
    description:
      "A hardy local chicken well-adapted to backyard conditions, valued for flavorful meat and eggs.",
    image:
      "images/imagesnative-chicken.jpg.png.png",
    stock: 20,
    sex: "Female",
    weight: "1.7 kg",
    purpose: "Dual-purpose (eggs and meat)",
  },
  {
    id: "chicken-006",
    name: "Broiler Chicken",
    breed: "Broiler",
    age: 2,
    price: 250,
    description:
      "A fast-growing meat chicken raised for efficient meat production.",
    image:
      "images/broiler.jpg.png.png",
    stock: 30,
    sex: "Mixed",
    weight: "1.5 kg",
    purpose: "Meat production",
  },
  {
    id: "chicken-007",
    name: "Australorp",
    breed: "Australorp",
    age: 7,
    price: 500,
    description:
      "A mature black hen with excellent egg-laying records and a gentle nature suited to family flocks.",
    image:
      "images/australorp.jpg.png.png",
    stock: 10,

    sex: "Female",
    weight: "2.3 kg",
    purpose: "Egg production",
  },
];

let products = [];

function loadProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem("fresh_feathers_version");
    if (stored && version === STORAGE_VERSION) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed.map(function (p) {
          if (!p.image || !p.image.trim()) {
            p.image = "images/imagesrhode-island-red.jpg.png.png";
          } else {
            p.image = fixImagePath(p.image);
          }
          return p;
        });
        return;
      }
    }
  } catch (e) {
    // ignore storage errors, fall back to seed
  }
  products = seedProducts.map(function (p) {
    p = Object.assign({}, p);
    p.image = fixImagePath(p.image);
    return p;
  });
  saveProducts();
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem("fresh_feathers_version", STORAGE_VERSION);
  } catch (e) {
    // ignore quota errors
  }
}

loadProducts();
