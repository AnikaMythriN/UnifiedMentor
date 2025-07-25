"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Filter, ShoppingCart, Store, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"
import { getShops, getProducts, getOffers } from "@/lib/firebase"

interface Shop {
  id: string
  name: string
  description: string
  location: string
  rating: number
  category: string
  floor: string
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
}

interface Offer {
  id: string
  title: string
  discount: string
  shopId: string
  shopName: string
  validUntil: string
}

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFloor, setSelectedFloor] = useState("all")
  const [loading, setLoading] = useState(true)

  const categories = ["Electronics", "Fashion", "Food", "Books", "Home & Garden", "Sports"]
  const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      logger.info("Loading homepage data")
      const [shopsData, productsData, offersData] = await Promise.all([getShops(), getProducts(), getOffers()])

      setShops(shopsData.slice(0, 6)) // Show first 6 shops
      setProducts(productsData.slice(0, 8)) // Show first 8 products
      setOffers(offersData.slice(0, 4)) // Show first 4 offers
      setLoading(false)
      logger.info("Homepage data loaded successfully")
    } catch (error) {
      logger.error("Error loading homepage data:", error)
      setLoading(false)
    }
  }

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || shop.category === selectedCategory
    const matchesFloor = selectedFloor === "all" || shop.floor === selectedFloor
    return matchesSearch && matchesCategory && matchesFloor
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading SuperMall...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">SuperMall</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-primary">
                Home
              </Link>
              <Link href="/shops" className="text-gray-600 hover:text-primary">
                Shops
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary">
                Products
              </Link>
              <Link href="/offers" className="text-gray-600 hover:text-primary">
                Offers
              </Link>

            </nav>
            <Button asChild>
              <Link href="/admin">
                <Users className="h-4 w-4 mr-2" />
                Admin Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Welcome to SuperMall</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting rural merchants with global customers. Discover amazing products and support local businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search shops, products, or offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-gray-900"
              />
            </div>
            <Button size="lg" variant="secondary" className="h-12">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Store className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{shops.length}+</h3>
              <p className="text-gray-600">Active Shops</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{products.length}+</h3>
              <p className="text-gray-600">Products Available</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{offers.length}+</h3>
              <p className="text-gray-600">Active Offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Floor:</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Floors</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Offers</h2>
            <Button variant="outline" asChild>
              <Link href="/offers">View All Offers</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <CardDescription>{offer.shopName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-lg font-bold">
                      {offer.discount}
                    </Badge>
                    <span className="text-sm text-gray-500">Until {offer.validUntil}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Shops</h2>
            <Button variant="outline" asChild>
              <Link href="/shops">View All Shops</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <Card key={shop.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg">
                  <img
                    src={shop.image || `/placeholder.svg?height=200&width=300&text=${shop.name}`}
                    alt={shop.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{shop.name}</CardTitle>
                    <Badge variant="outline">{shop.category}</Badge>
                  </div>
                  <CardDescription>{shop.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{shop.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{shop.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild className="w-full">
                      <Link href={`/shops/${shop.id}`}>View Shop</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-t-lg">
                  <img
                    src={product.image || `/placeholder.svg?height=200&width=200&text=${product.name}`}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.shopName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-green-600">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Store className="h-8 w-8" />
                <h3 className="text-xl font-bold">SuperMall</h3>
              </div>
              <p className="text-gray-400">
                Connecting rural merchants with global customers through our innovative marketplace platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shops" className="text-gray-400 hover:text-white">
                    Shops
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="text-gray-400 hover:text-white">
                    Offers
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-400 hover:text-white">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((category) => (
                  <li key={category}>
                    <span className="text-gray-400">{category}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: support@supermall.com
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Address: 123 Mall Street, City, State 12345
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 SuperMall. All rights reserved. Built with Next.js and Firebase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
