import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatPrice, formatSquareFeet } from "@/utils/formatters"

const PropertyCard = ({ property, isSaved, onToggleSave }) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`)
  }

  const handleSaveClick = (e) => {
    e.stopPropagation()
    onToggleSave(property.Id)
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        {!imageError ? (
          <img
            src={property.images?.[0] || "/api/placeholder/400/300"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
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
          onClick={handleSaveClick}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-lg backdrop-blur-sm transition-colors duration-200 ${
            isSaved 
              ? "bg-accent-500 text-white hover:bg-accent-600" 
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-accent-500"
          }`}
        >
          <ApperIcon 
            name={isSaved ? "Heart" : "Heart"} 
            size={16} 
            className={isSaved ? "fill-current" : ""} 
          />
        </Button>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={getStatusColor(property.status)}>
            {property.status || "For Sale"}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <h3 className="font-display text-2xl font-bold text-primary-700">
            {formatPrice(property.price)}
          </h3>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
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
        </div>

        {/* Title */}
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h4>

        {/* Address */}
        <div className="flex items-start gap-1 text-sm text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </span>
        </div>

        {/* Property Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-secondary-600 capitalize">
            {property.propertyType}
          </span>
          {property.yearBuilt && (
            <span className="text-sm text-gray-500">
              Built {property.yearBuilt}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard