"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Store, ShoppingCart, TrendingUp, Plus, Edit, Trash2, LogIn, LogOut } from "lucide-react"
import { logger } from "@/lib/logger"
import {
  loginAdmin,
  logoutAdmin,
  isAdminLoggedIn,
  getShops,
  getProducts,
  getOffers,
  addShop,
  updateShop,
  deleteShop,
  addProduct,
  updateProduct,
  deleteProduct,
  addOffer,
  updateOffer,
  deleteOffer,
} from "@/lib/firebase"

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

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loading, setLoading] = useState(false)

  // Data states
  const [shops, setShops] = useState<Shop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])

  // Form states
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

  const categories = ["Electronics", "Fashion", "Food", "Books", "Home & Garden", "Sports"]
  const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"]

  useEffect(() => {
    checkLoginStatus()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadData()
    }
  }, [isLoggedIn])

  const checkLoginStatus = () => {
    const loggedIn = isAdminLoggedIn()
    setIsLoggedIn(loggedIn)
    logger.info("Admin login status checked:", loggedIn)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError("")

    try {
      logger.info("Admin login attempt:", email)
      const success = await loginAdmin(email, password)

      if (success) {
        setIsLoggedIn(true)
        setEmail("")
        setPassword("")
        logger.info("Admin login successful")
      } else {
        setLoginError("Invalid credentials")
        logger.warn("Admin login failed: Invalid credentials")
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.")
      logger.error("Admin login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    setIsLoggedIn(false)
    logger.info("Admin logged out")
  }

  const loadData = async () => {
    try {
      logger.info("Loading admin data")
      const [shopsData, productsData, offersData] = await Promise.all([getShops(), getProducts(), getOffers()])

      setShops(shopsData)
      setProducts(productsData)
      setOffers(offersData)
      logger.info("Admin data loaded successfully")
    } catch (error) {
      logger.error("Error loading admin data:", error)
    }
  }

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const shopData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      category: formData.get("category") as string,
      floor: formData.get("floor") as string,
      rating: Number.parseFloat(formData.get("rating") as string) || 0,
      image: (formData.get("image") as string) || "",
    }

    try {
      if (editingShop) {
        await updateShop(editingShop.id, shopData)
        logger.info("Shop updated:", editingShop.id)
      } else {
        await addShop(shopData)
        logger.info("Shop added:", shopData.name)
      }

      setEditingShop(null)
      loadData()
    } catch (error) {
      logger.error("Error saving shop:", error)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      originalPrice: Number.parseFloat(formData.get("originalPrice") as string) || undefined,
      shopId: formData.get("shopId") as string,
      shopName: shops.find((s) => s.id === formData.get("shopId"))?.name || "",
      category: formData.get("category") as string,
      image: (formData.get("image") as string) || "",
      rating: Number.parseFloat(formData.get("rating") as string) || 0,
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        logger.info("Product updated:", editingProduct.id)
      } else {
        await addProduct(productData)
        logger.info("Product added:", productData.name)
      }

      setEditingProduct(null)
      loadData()
    } catch (error) {
      logger.error("Error saving product:", error)
    }
  }

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const offerData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      discount: formData.get("discount") as string,
      shopId: formData.get("shopId") as string,
      shopName: shops.find((s) => s.id === formData.get("shopId"))?.name || "",
      validUntil: formData.get("validUntil") as string,
    }

    try {
      if (editingOffer) {
        await updateOffer(editingOffer.id, offerData)
        logger.info("Offer updated:", editingOffer.id)
      } else {
        await addOffer(offerData)
        logger.info("Offer added:", offerData.title)
      }

      setEditingOffer(null)
      loadData()
    } catch (error) {
      logger.error("Error saving offer:", error)
    }
  }

  const handleDeleteShop = async (id: string) => {
    if (confirm("Are you sure you want to delete this shop?")) {
      try {
        await deleteShop(id)
        logger.info("Shop deleted:", id)
        loadData()
      } catch (error) {
        logger.error("Error deleting shop:", error)
      }
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        logger.info("Product deleted:", id)
        loadData()
      } catch (error) {
        logger.error("Error deleting product:", error)
      }
    }
  }

  const handleDeleteOffer = async (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        await deleteOffer(id)
        logger.info("Offer deleted:", id)
        loadData()
      } catch (error) {
        logger.error("Error deleting offer:", error)
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supermall.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Demo credentials:</p>
              <p>Email: admin@supermall.com</p>
              <p>Password: Anich</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">SuperMall Admin</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shops.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="shops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shops">Manage Shops</TabsTrigger>
            <TabsTrigger value="products">Manage Products</TabsTrigger>
            <TabsTrigger value="offers">Manage Offers</TabsTrigger>
          </TabsList>

          {/* Shops Management */}
          <TabsContent value="shops" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Shop Management</h2>
              <Button onClick={() => setEditingShop({} as Shop)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Shop
              </Button>
            </div>

            {editingShop && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingShop.id ? "Edit Shop" : "Add New Shop"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShopSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Shop Name</Label>
                      <Input id="name" name="name" defaultValue={editingShop.name} required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        defaultValue={editingShop.category}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" defaultValue={editingShop.location} required />
                    </div>
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                      <select
                        id="floor"
                        name="floor"
                        defaultValue={editingShop.floor}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select Floor</option>
                        {floors.map((floor) => (
                          <option key={floor} value={floor}>
                            {floor}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={editingShop.rating}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" type="url" defaultValue={editingShop.image} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" defaultValue={editingShop.description} required />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <Button type="submit">{editingShop.id ? "Update Shop" : "Add Shop"}</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingShop(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Card key={shop.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{shop.name}</CardTitle>
                      <Badge variant="outline">{shop.category}</Badge>
                    </div>
                    <CardDescription>{shop.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Location:</strong> {shop.location}
                      </p>
                      <p>
                        <strong>Floor:</strong> {shop.floor}
                      </p>
                      <p>
                        <strong>Rating:</strong> {shop.rating}/5
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => setEditingShop(shop)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteShop(shop.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Button onClick={() => setEditingProduct({} as Product)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {editingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct.id ? "Edit Product" : "Add New Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" defaultValue={editingProduct.name} required />
                    </div>
                    <div>
                      <Label htmlFor="shopId">Shop</Label>
                      <select
                        id="shopId"
                        name="shopId"
                        defaultValue={editingProduct.shopId}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select Shop</option>
                        {shops.map((shop) => (
                          <option key={shop.id} value={shop.id}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        defaultValue={editingProduct.category}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={editingProduct.price}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price ($)</Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={editingProduct.originalPrice}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={editingProduct.rating}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" type="url" defaultValue={editingProduct.image} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" defaultValue={editingProduct.description} required />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <Button type="submit">{editingProduct.id ? "Update Product" : "Add Product"}</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.shopName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Category:</strong> {product.category}
                      </p>
                      <p>
                        <strong>Price:</strong> ${product.price}
                      </p>
                      {product.originalPrice && (
                        <p>
                          <strong>Original Price:</strong> ${product.originalPrice}
                        </p>
                      )}
                      <p>
                        <strong>Rating:</strong> {product.rating}/5
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Offers Management */}
          <TabsContent value="offers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Offer Management</h2>
              <Button onClick={() => setEditingOffer({} as Offer)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Offer
              </Button>
            </div>

            {editingOffer && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingOffer.id ? "Edit Offer" : "Add New Offer"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOfferSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Offer Title</Label>
                      <Input id="title" name="title" defaultValue={editingOffer.title} required />
                    </div>
                    <div>
                      <Label htmlFor="shopId">Shop</Label>
                      <select
                        id="shopId"
                        name="shopId"
                        defaultValue={editingOffer.shopId}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select Shop</option>
                        {shops.map((shop) => (
                          <option key={shop.id} value={shop.id}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount</Label>
                      <Input
                        id="discount"
                        name="discount"
                        placeholder="e.g., 20% OFF, Buy 1 Get 1"
                        defaultValue={editingOffer.discount}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Valid Until</Label>
                      <Input
                        id="validUntil"
                        name="validUntil"
                        type="date"
                        defaultValue={editingOffer.validUntil}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" defaultValue={editingOffer.description} required />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <Button type="submit">{editingOffer.id ? "Update Offer" : "Add Offer"}</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingOffer(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <CardDescription>{offer.shopName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Discount:</strong> {offer.discount}
                      </p>
                      <p>
                        <strong>Valid Until:</strong> {offer.validUntil}
                      </p>
                      <p>
                        <strong>Description:</strong> {offer.description}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => setEditingOffer(offer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteOffer(offer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
