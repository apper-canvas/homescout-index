import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PropertyCard from "@/components/molecules/PropertyCard"
import ViewToggle from "@/components/molecules/ViewToggle"
import PropertyList from "@/components/organisms/PropertyList"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { getSavedProperties, removeSavedProperty } from "@/services/api/savedPropertiesService"
import { getPropertyById } from "@/services/api/propertiesService"
import { toast } from "react-toastify"

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState("grid")

  useEffect(() => {
    loadSavedProperties()
  }, [])

  const loadSavedProperties = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const saved = await getSavedProperties()
      setSavedProperties(saved)
      
      // Load full property details for each saved property
      const propertyPromises = saved.map(item => getPropertyById(item.propertyId))
      const propertyDetails = await Promise.all(propertyPromises)
      setProperties(propertyDetails.filter(Boolean))
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveProperty = async (propertyId) => {
    try {
      await removeSavedProperty(propertyId)
      setSavedProperties(prev => prev.filter(item => item.propertyId !== propertyId))
      setProperties(prev => prev.filter(property => property.Id !== propertyId))
      toast.success("Property removed from saved list")
    } catch (error) {
      console.error("Error removing saved property:", error)
      toast.error("Failed to remove property")
    }
  }

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to remove all saved properties?")) {
      try {
        // Remove all saved properties
        const removePromises = savedProperties.map(item => removeSavedProperty(item.propertyId))
        await Promise.all(removePromises)
        
        setSavedProperties([])
        setProperties([])
        toast.success("All saved properties removed")
      } catch (error) {
        console.error("Error clearing saved properties:", error)
        toast.error("Failed to clear saved properties")
      }
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSavedProperties} />
  
  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Empty
          title="No saved properties yet"
          message="Start browsing properties and save your favorites to see them here."
          actionText="Browse Properties"
          onAction={() => window.location.href = "/"}
          icon="Heart"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-700 mb-2">
              Saved Properties
            </h1>
            <p className="text-gray-600">
              You have {properties.length} saved propert{properties.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          
          {properties.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} />
              Clear All
            </Button>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            <span className="font-semibold text-primary-700">{properties.length}</span>{" "}
            saved propert{properties.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        
        <ViewToggle view={view} onViewChange={setView} />
      </motion.div>

      {/* Properties Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard
                  property={property}
                  isSaved={true}
                  onToggleSave={handleRemoveProperty}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <PropertyList
            properties={properties}
            loading={false}
            error={null}
            onRetry={() => {}}
          />
        )}
      </motion.div>
    </div>
  )
}

export default SavedPropertiesPage