"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Filter, Store } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"
import { getShops } from "@/lib/firebase"

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

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [filteredShops, setFilteredShops] = useState<Shop[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFloor, setSelectedFloor] = useState("all")
  const [loading, setLoading] = useState(true)

  const categories = ["Electronics", "Fashion", "Food", "Books", "Home & Garden", "Sports"]
  const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"]

  useEffect(() => {
    loadShops()
  }, [])

  useEffect(() => {
    filterShops()
  }, [shops, searchTerm, selectedCategory, selectedFloor])

  const loadShops = async () => {
    try {
      logger.info("Loading shops page")
      const shopsData = await getShops()
      setShops(shopsData)
      setLoading(false)
      logger.info("Shops loaded successfully:", shopsData.length)
    } catch (error) {
      logger.error("Error loading shops:", error)
      setLoading(false)
    }
  }

  const filterShops = () => {
    const filtered = shops.filter((shop) => {
      const matchesSearch =
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || shop.category === selectedCategory
      const matchesFloor = selectedFloor === "all" || shop.floor === selectedFloor
      return matchesSearch && matchesCategory && matchesFloor
    })

    setFilteredShops(filtered)
    logger.info("Shops filtered:", filtered.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading shops...</p>
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
              <Link href="/admin" className="text-gray-600 hover:text-primary">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Shops</h1>
          <p className="text-gray-600">Discover amazing shops and support local businesses in our SuperMall</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search shops by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
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
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
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
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredShops.length} of {shops.length} shops
          </p>
        </div>

        {/* Shops Grid */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters to find more shops.</p>
          </div>
        ) : (
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{shop.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{shop.rating}/5</span>
                      </div>
                      <Badge variant="secondary">{shop.floor}</Badge>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/shops/${shop.id}`}>View Shop Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
