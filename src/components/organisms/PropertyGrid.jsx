import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PropertyCard from "@/components/molecules/PropertyCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { getSavedProperties, toggleSavedProperty } from "@/services/api/savedPropertiesService"
import { toast } from "react-toastify"

const PropertyGrid = ({ properties, loading, error, onRetry }) => {
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set())
  const [savingProperty, setSavingProperty] = useState(null)

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

  const handleToggleSave = async (propertyId) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {properties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <PropertyCard
              property={property}
              isSaved={savedPropertyIds.has(property.Id)}
              onToggleSave={handleToggleSave}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PropertyGrid