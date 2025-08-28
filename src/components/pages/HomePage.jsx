import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import PropertyGrid from "@/components/organisms/PropertyGrid"
import PropertyList from "@/components/organisms/PropertyList"
import PropertyFilters from "@/components/molecules/PropertyFilters"
import ViewToggle from "@/components/molecules/ViewToggle"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { getAllProperties } from "@/services/api/propertiesService"

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    minBeds: "",
    minBaths: "",
    minSqft: "",
    maxSqft: ""
  })

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters])

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    if (searchQuery && searchQuery !== filters.location) {
      setFilters(prev => ({ ...prev, location: searchQuery }))
    }
  }, [searchParams])

  const loadProperties = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await getAllProperties()
      setProperties(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Location filter
    if (filters.location.trim()) {
      const location = filters.location.toLowerCase()
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(location) ||
        property.address?.toLowerCase().includes(location) ||
        property.city?.toLowerCase().includes(location) ||
        property.state?.toLowerCase().includes(location) ||
        property.zipCode?.includes(location)
      )
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseFloat(filters.maxPrice))
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.propertyType?.toLowerCase() === filters.propertyType.toLowerCase()
      )
    }

    // Bedroom filter
    if (filters.minBeds) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.minBeds))
    }

    // Bathroom filter
    if (filters.minBaths) {
      filtered = filtered.filter(property => property.bathrooms >= parseFloat(filters.minBaths))
    }

    // Square footage filters
    if (filters.minSqft) {
      filtered = filtered.filter(property => property.squareFeet >= parseInt(filters.minSqft))
    }
    if (filters.maxSqft) {
      filtered = filtered.filter(property => property.squareFeet <= parseInt(filters.maxSqft))
    }

    setFilteredProperties(filtered)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      minBeds: "",
      minBaths: "",
      minSqft: "",
      maxSqft: ""
    })
    setSearchParams({})
  }

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, location: query }))
    setSearchParams(query ? { search: query } : {})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "")

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover amazing properties in your area with our comprehensive search and filtering tools.
        </p>
        
        {/* Desktop Search */}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by location, city, or zip code..."
            className="w-full"
          />
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24">
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  <span className="font-semibold text-primary-700">
                    {filteredProperties.length}
                  </span>{" "}
                  properties found
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="flex items-center gap-1"
                  >
                    <ApperIcon name="X" size={14} />
                    Clear
                  </Button>
                )}
              </div>

              {/* Mobile Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2"
              >
                <ApperIcon name="SlidersHorizontal" size={16} />
                Filters
              </Button>
            </div>

            <ViewToggle view={view} onViewChange={setView} />
          </motion.div>

          {/* Properties Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {view === "grid" ? (
              <PropertyGrid
                properties={filteredProperties}
                loading={loading}
                error={error}
                onRetry={loadProperties}
              />
            ) : view === "list" ? (
              <PropertyList
                properties={filteredProperties}
                loading={loading}
                error={error}
                onRetry={loadProperties}
              />
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="Map" size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View Coming Soon</h3>
                <p className="text-gray-600">We're working on an interactive map view for better property exploration.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HomePage