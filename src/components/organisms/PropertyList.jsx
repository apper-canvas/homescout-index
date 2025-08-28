import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { formatPrice, formatSquareFeet } from "@/utils/formatters"
import { getSavedProperties, toggleSavedProperty } from "@/services/api/savedPropertiesService"
import { toast } from "react-toastify"

const PropertyList = ({ properties, loading, error, onRetry }) => {
  const navigate = useNavigate()
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set())
  const [savingProperty, setSavingProperty] = useState(null)
  const [imageErrors, setImageErrors] = useState(new Set())

  useEffect(() => {
    const loadSavedProperties = async () => {
      try {
        const saved = await getSavedProperties()
        const ids = new Set(saved.map(item => item.propertyId))
        setSavedPropertyIds(ids)
      } catch (error) {
        console.error("Error loading saved properties:", error)
      }
    }
    loadSavedProperties()
  }, [])

  const handleToggleSave = async (propertyId, e) => {
    e.stopPropagation()
    if (savingProperty === propertyId) return

    setSavingProperty(propertyId)
    const wasSaved = savedPropertyIds.has(propertyId)

    try {
      await toggleSavedProperty(propertyId)
      
      setSavedPropertyIds(prev => {
        const newSet = new Set(prev)
        if (wasSaved) {
          newSet.delete(propertyId)
          toast.success("Property removed from saved list")
        } else {
          newSet.add(propertyId)
          toast.success("Property saved to your list")
        }
        return newSet
      })
    } catch (error) {
      console.error("Error toggling saved property:", error)
      toast.error("Failed to update saved properties")
    } finally {
      setSavingProperty(null)
    }
  }

  const handleImageError = (propertyId) => {
    setImageErrors(prev => new Set(prev).add(propertyId))
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "for sale":
        return "success"
      case "pending":
        return "warning"
      case "sold":
        return "error"
      default:
        return "default"
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={onRetry} />
  if (!properties || properties.length === 0) {
    return (
      <Empty
        title="No properties found"
        message="Try adjusting your search criteria or filters to find more properties."
        actionText="Clear Filters"
        onAction={() => window.location.href = "/"}
      />
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {properties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
            onClick={() => navigate(`/property/${property.Id}`)}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-64 h-48 sm:h-40 bg-gray-100 flex-shrink-0">
                {!imageErrors.has(property.Id) ? (
                  <img
                    src={property.images?.[0] || "/api/placeholder/300/200"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(property.Id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ApperIcon name="Home" size={40} className="text-gray-400" />
                  </div>
                )}
                
                {/* Save Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleToggleSave(property.Id, e)}
                  className={`absolute top-2 right-2 p-2 rounded-full shadow-lg backdrop-blur-sm transition-colors duration-200 ${
                    savedPropertyIds.has(property.Id)
                      ? "bg-accent-500 text-white hover:bg-accent-600" 
                      : "bg-white/90 text-gray-600 hover:bg-white hover:text-accent-500"
                  }`}
                >
                  <ApperIcon 
                    name="Heart" 
                    size={16} 
                    className={savedPropertyIds.has(property.Id) ? "fill-current" : ""} 
                  />
                </Button>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant={getStatusColor(property.status)}>
                    {property.status || "For Sale"}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Price */}
                    <h3 className="font-display text-2xl font-bold text-primary-700 mb-2">
                      {formatPrice(property.price)}
                    </h3>

                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h4>

                    {/* Address */}
                    <div className="flex items-start gap-1 text-sm text-gray-600 mb-3">
                      <ApperIcon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {property.address}, {property.city}, {property.state} {property.zipCode}
                      </span>
                    </div>

                    {/* Property Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Bed" size={16} />
                        <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Bath" size={16} />
                        <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Square" size={16} />
                        <span>{formatSquareFeet(property.squareFeet)}</span>
                      </div>
                      {property.yearBuilt && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={16} />
                          <span>Built {property.yearBuilt}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-600 capitalize">
                      {property.propertyType}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/property/${property.Id}`)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PropertyList