"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Store, Tag } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"
import { getOffers } from "@/lib/firebase"

interface Offer {
  id: string
  title: string
  description: string
  discount: string
  shopId: string
  shopName: string
  validUntil: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOffers()
  }, [])

  useEffect(() => {
    filterOffers()
  }, [offers, searchTerm])

  const loadOffers = async () => {
    try {
      logger.info("Loading offers page")
      const offersData = await getOffers()
      setOffers(offersData)
      setLoading(false)
      logger.info("Offers loaded successfully:", offersData.length)
    } catch (error) {
      logger.error("Error loading offers:", error)
      setLoading(false)
    }
  }

  const filterOffers = () => {
    const filtered = offers.filter((offer) => {
      const matchesSearch =
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.discount.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })

    setFilteredOffers(filtered)
    logger.info("Offers filtered:", filtered.length)
  }

  const isOfferExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const getDaysRemaining = (validUntil: string) => {
    const today = new Date()
    const expiry = new Date(validUntil)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading offers...</p>
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
              <Link href="/shops" className="text-gray-600 hover:text-primary">
                Shops
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary">
                Products
              </Link>
              <Link href="/offers" className="text-gray-900 hover:text-primary">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h1>
          <p className="text-gray-600">Don't miss out on these amazing deals from our partner shops</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search offers by title, description, shop, or discount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredOffers.length} of {offers.length} offers
          </p>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria to find more offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const expired = isOfferExpired(offer.validUntil)
              const daysRemaining = getDaysRemaining(offer.validUntil)

              return (
                <Card key={offer.id} className={`hover:shadow-lg transition-shadow ${expired ? "opacity-60" : ""}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{offer.title}</CardTitle>
                      <Badge
                        variant={expired ? "destructive" : daysRemaining <= 3 ? "destructive" : "secondary"}
                        className="text-lg font-bold"
                      >
                        {offer.discount}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-1">
                      <Store className="h-4 w-4" />
                      <span>{offer.shopName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{offer.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                      {!expired && (
                        <Badge variant={daysRemaining <= 3 ? "destructive" : "outline"}>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : "Last day!"}
                        </Badge>
                      )}
                      {expired && <Badge variant="destructive">Expired</Badge>}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" disabled={expired} asChild={!expired}>
                        {expired ? "Offer Expired" : <Link href={`/shops/${offer.shopId}`}>Claim Offer</Link>}
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/shops/${offer.shopId}`}>Visit Shop</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
