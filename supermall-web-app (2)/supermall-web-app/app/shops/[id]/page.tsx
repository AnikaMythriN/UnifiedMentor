"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Phone, Mail, Clock, ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { logger } from "@/lib/logger"
import { getShops, getProducts } from "@/lib/firebase"

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
  description: string
}

export default function ShopDetailPage() {
  const params = useParams()
  const shopId = params.id as string

  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (shopId) {
      loadShopDetails()
    }
  }, [shopId])

  const loadShopDetails = async () => {
    try {
      logger.logPageView(`shop-detail-${shopId}`)
      logger.info("Loading shop details", { shopId })

      const [shopsData, productsData] = await Promise.all([getShops(), getProducts()])

      const foundShop = shopsData.find((s) => s.id === shopId)
      if (!foundShop) {
        setError("Shop not found")
        logger.warn("Shop not found", { shopId })
        return
      }

      const shopProducts = productsData.filter((p) => p.shopId === shopId)

      setShop(foundShop)
      setProducts(shopProducts)
      setLoading(false)

      logger.info("Shop details loaded successfully", {
        shopId,
        shopName: foundShop.name,
        productsCount: shopProducts.length,
      })
    } catch (error) {
      logger.error("Error loading shop details:", error)
      setError("Failed to load shop details")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading shop details...</p>
        </div>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Shop not found"}</h2>
          <Button asChild>
            <Link href="/shops">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shops
            </Link>
          </Button>
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
            <Button variant="ghost" asChild>
              <Link href="/shops">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shops
              </Link>
            </Button>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary">
                Home
              </Link>
              <Link href="/shops" className="text-gray-900 hover:text-primary">
                Shops
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary">
                Products
              </Link>
              <Link href="/offers" className="text-gray-600 hover:text-primary">
                Offers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4">
                <img
                  src={shop.image || `/placeholder.svg?height=400&width=400&text=${shop.name}`}
                  alt={shop.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {shop.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-medium">{shop.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg mb-6">{shop.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{shop.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gray-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">F</span>
                    </div>
                    <div>
                      <p className="font-medium">Floor</p>
                      <p className="text-gray-600">{shop.floor}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">contact@{shop.name.toLowerCase().replace(/\s+/g, "")}.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-gray-600">Mon-Sun: 10:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Products ({products.length})</h2>
            <Button variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">This shop hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
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
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
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

                      {product.originalPrice && (
                        <Badge variant="secondary" className="w-fit">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}

                      <Button className="w-full">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Shop Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>About This Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  {shop.name} is a premier {shop.category.toLowerCase()} destination located on the{" "}
                  {shop.floor.toLowerCase()} of SuperMall. We pride ourselves on offering high-quality products and
                  exceptional customer service.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Category</p>
                    <p className="text-gray-600">{shop.category}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rating</p>
                    <p className="text-gray-600">{shop.rating}/5 stars</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Products</p>
                    <p className="text-gray-600">{products.length} items</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Floor</p>
                    <p className="text-gray-600">{shop.floor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visit Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{shop.location}</p>
                  <p className="text-gray-600">{shop.floor}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Store Hours</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Monday - Friday: 10:00 AM - 10:00 PM</p>
                    <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Email: contact@{shop.name.toLowerCase().replace(/\s+/g, "")}.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
