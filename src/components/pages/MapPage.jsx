import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { getAllProperties } from "@/services/api/propertiesService"
import { formatPrice } from "@/utils/formatters"

const MapPage = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    loadProperties()
  }, [])

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

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProperties} />

  return (
    <div className="h-[calc(100vh-80px)] bg-background relative overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto flex items-center justify-center shadow-xl">
              <ApperIcon name="Map" size={48} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center animate-pulse">
              <ApperIcon name="MapPin" size={16} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-pulse delay-300">
              <ApperIcon name="Home" size={12} className="text-white" />
            </div>
          </div>
          
          <h2 className="font-display text-3xl font-bold text-primary-700 mb-4">
            Interactive Map Coming Soon
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're building an amazing interactive map experience that will let you explore properties with location markers, neighborhood insights, and instant property previews.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ApperIcon name="MapPin" size={16} className="text-primary-500" />
              <span>Property location markers</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Layers" size={16} className="text-primary-500" />
              <span>Neighborhood boundaries</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Eye" size={16} className="text-primary-500" />
              <span>Quick property previews</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Search" size={16} />
              Browse Properties
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/saved"}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Heart" size={16} />
              View Saved
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Properties Count Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200"
      >
        <div className="flex items-center gap-2">
          <ApperIcon name="Home" size={20} className="text-primary-500" />
          <span className="font-semibold text-primary-700">
            {properties.length} Properties Available
          </span>
        </div>
      </motion.div>

      {/* Sample Property Cards */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-4 overflow-x-auto pb-2">
        {properties.slice(0, 3).map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 min-w-[300px] cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.href = `/property/${property.Id}`}
          >
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ApperIcon name="Home" size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-lg font-bold text-primary-700 mb-1">
                  {formatPrice(property.price)}
                </h4>
                <p className="text-sm text-gray-600 truncate mb-1">
                  {property.city}, {property.state}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span className="capitalize">{property.propertyType}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MapPage