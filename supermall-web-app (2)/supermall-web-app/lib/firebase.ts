// Firebase configuration and functions
// This is a mock implementation for demonstration purposes
// In a real application, you would use actual Firebase SDK

interface Shop {
  id: string
  name: string
  description: string
  location: string
  category: string
  floor: string
  rating: number
  image: string
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  shopId: string
  shopName: string
  category: string
  image: string
  rating: number
  description: string
}

interface Offer {
  id: string
  title: string
  description: string
  discount: string
  shopId: string
  shopName: string
  validUntil: string
}

// Mock data storage
let mockShops: Shop[] = [
  {
    id: "1",
    name: "TechWorld Electronics",
    description: "Latest gadgets and electronics for tech enthusiasts",
    location: "Mall Center, Section A",
    category: "Electronics",
    floor: "Ground Floor",
    rating: 4.5,
    image: "",
  },
  {
    id: "2",
    name: "Fashion Forward",
    description: "Trendy clothing and accessories for all ages",
    location: "Mall Center, Section B",
    category: "Fashion",
    floor: "First Floor",
    rating: 4.2,
    image: "",
  },
  {
    id: "3",
    name: "Gourmet Corner",
    description: "Delicious food and beverages",
    location: "Food Court, Section C",
    category: "Food",
    floor: "Second Floor",
    rating: 4.7,
    image: "",
  },
  {
    id: "4",
    name: "Book Haven",
    description: "Wide collection of books and educational materials",
    location: "Mall Center, Section D",
    category: "Books",
    floor: "First Floor",
    rating: 4.3,
    image: "",
  },
  {
    id: "5",
    name: "Home & Garden Plus",
    description: "Everything for your home and garden needs",
    location: "Mall Center, Section E",
    category: "Home & Garden",
    floor: "Ground Floor",
    rating: 4.1,
    image: "",
  },
  {
    id: "6",
    name: "Sports Zone",
    description: "Sports equipment and fitness gear",
    location: "Mall Center, Section F",
    category: "Sports",
    floor: "Third Floor",
    rating: 4.4,
    image: "",
  },
]

let mockProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Pro Max",
    description: "Latest flagship smartphone with advanced features",
    price: 999,
    originalPrice: 1199,
    shopId: "1",
    shopName: "TechWorld Electronics",
    category: "Electronics",
    image: "",
    rating: 4.6,
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 299,
    originalPrice: 399,
    shopId: "1",
    shopName: "TechWorld Electronics",
    category: "Electronics",
    image: "",
    rating: 4.4,
  },
  {
    id: "3",
    name: "Designer Jacket",
    description: "Stylish winter jacket for modern fashion",
    price: 149,
    shopId: "2",
    shopName: "Fashion Forward",
    category: "Fashion",
    image: "",
    rating: 4.3,
  },
  {
    id: "4",
    name: "Casual Sneakers",
    description: "Comfortable sneakers for everyday wear",
    price: 89,
    originalPrice: 120,
    shopId: "2",
    shopName: "Fashion Forward",
    category: "Fashion",
    image: "",
    rating: 4.2,
  },
  {
    id: "5",
    name: "Gourmet Pizza",
    description: "Delicious handmade pizza with premium ingredients",
    price: 18,
    shopId: "3",
    shopName: "Gourmet Corner",
    category: "Food",
    image: "",
    rating: 4.8,
  },
  {
    id: "6",
    name: "Programming Guide",
    description: "Complete guide to modern programming languages",
    price: 45,
    originalPrice: 60,
    shopId: "4",
    shopName: "Book Haven",
    category: "Books",
    image: "",
    rating: 4.5,
  },
  {
    id: "7",
    name: "Garden Tool Set",
    description: "Professional garden tools for home gardening",
    price: 79,
    shopId: "5",
    shopName: "Home & Garden Plus",
    category: "Home & Garden",
    image: "",
    rating: 4.1,
  },
  {
    id: "8",
    name: "Fitness Tracker",
    description: "Advanced fitness tracker with health monitoring",
    price: 199,
    originalPrice: 249,
    shopId: "6",
    shopName: "Sports Zone",
    category: "Sports",
    image: "",
    rating: 4.3,
  },
]

let mockOffers: Offer[] = [
  {
    id: "1",
    title: "Electronics Mega Sale",
    description: "Get up to 30% off on all electronics items",
    discount: "30% OFF",
    shopId: "1",
    shopName: "TechWorld Electronics",
    validUntil: "2024-12-31",
  },
  {
    id: "2",
    title: "Fashion Week Special",
    description: "Buy 2 get 1 free on all fashion items",
    discount: "Buy 2 Get 1",
    shopId: "2",
    shopName: "Fashion Forward",
    validUntil: "2024-11-30",
  },
  {
    id: "3",
    title: "Food Festival",
    description: "Special combo meals at discounted prices",
    discount: "25% OFF",
    shopId: "3",
    shopName: "Gourmet Corner",
    validUntil: "2024-10-31",
  },
  {
    id: "4",
    title: "Book Lovers Deal",
    description: "Free shipping on orders above $30",
    discount: "Free Shipping",
    shopId: "4",
    shopName: "Book Haven",
    validUntil: "2024-12-15",
  },
]

// Admin authentication
const ADMIN_CREDENTIALS = {
  email: "admin@supermall.com",
  password: "Anich",
}

// Authentication functions
export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem("adminLoggedIn", "true")
    return true
  }
  return false
}

export const logoutAdmin = (): void => {
  localStorage.removeItem("adminLoggedIn")
}

export const isAdminLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("adminLoggedIn") === "true"
}

// Shop functions
export const getShops = async (): Promise<Shop[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockShops]
}

export const addShop = async (shopData: Omit<Shop, "id">): Promise<Shop> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newShop: Shop = {
    ...shopData,
    id: Date.now().toString(),
  }
  mockShops.push(newShop)
  return newShop
}

export const updateShop = async (id: string, shopData: Omit<Shop, "id">): Promise<Shop> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockShops.findIndex((shop) => shop.id === id)
  if (index !== -1) {
    mockShops[index] = { ...shopData, id }
    return mockShops[index]
  }
  throw new Error("Shop not found")
}

export const deleteShop = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  mockShops = mockShops.filter((shop) => shop.id !== id)
  // Also remove related products and offers
  mockProducts = mockProducts.filter((product) => product.shopId !== id)
  mockOffers = mockOffers.filter((offer) => offer.shopId !== id)
}

// Product functions
export const getProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockProducts]
}

export const addProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
  }
  mockProducts.push(newProduct)
  return newProduct
}

export const updateProduct = async (id: string, productData: Omit<Product, "id">): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockProducts.findIndex((product) => product.id === id)
  if (index !== -1) {
    mockProducts[index] = { ...productData, id }
    return mockProducts[index]
  }
  throw new Error("Product not found")
}

export const deleteProduct = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  mockProducts = mockProducts.filter((product) => product.id !== id)
}

// Offer functions
export const getOffers = async (): Promise<Offer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockOffers]
}

export const addOffer = async (offerData: Omit<Offer, "id">): Promise<Offer> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newOffer: Offer = {
    ...offerData,
    id: Date.now().toString(),
  }
  mockOffers.push(newOffer)
  return newOffer
}

export const updateOffer = async (id: string, offerData: Omit<Offer, "id">): Promise<Offer> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockOffers.findIndex((offer) => offer.id === id)
  if (index !== -1) {
    mockOffers[index] = { ...offerData, id }
    return mockOffers[index]
  }
  throw new Error("Offer not found")
}

export const deleteOffer = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  mockOffers = mockOffers.filter((offer) => offer.id !== id)
}
