import { useState } from "react"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import Label from "@/components/atoms/Label"
import ApperIcon from "@/components/ApperIcon"
import { motion, AnimatePresence } from "framer-motion"

const PropertyFilters = ({ filters, onFiltersChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const propertyTypes = [
    { value: "", label: "All Types" },
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "land", label: "Land" }
  ]

  const bedOptions = [
    { value: "", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" }
  ]

  const bathOptions = [
    { value: "", label: "Any" },
    { value: "1", label: "1+" },
    { value: "1.5", label: "1.5+" },
    { value: "2", label: "2+" },
    { value: "2.5", label: "2.5+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <ApperIcon name="SlidersHorizontal" size={20} />
            Filters
          </span>
          <ApperIcon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={20} 
          />
        </Button>
      </div>

{/* Filter Content */}
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`${isOpen ? 'block' : 'hidden'} lg:block`}
        >
            <div className="p-4 space-y-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    inputClassName="text-sm"
                  />
                  <FormField
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    inputClassName="text-sm"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={filters.propertyType || ""}
                  onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select
                    value={filters.minBeds || ""}
                    onChange={(e) => handleFilterChange("minBeds", e.target.value)}
                  >
                    {bedOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Select
                    value={filters.minBaths || ""}
                    onChange={(e) => handleFilterChange("minBaths", e.target.value)}
                  >
                    {bathOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Square Footage */}
              <div className="space-y-2">
                <Label>Square Footage</Label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    type="number"
                    placeholder="Min Sqft"
                    value={filters.minSqft || ""}
                    onChange={(e) => handleFilterChange("minSqft", e.target.value)}
                    inputClassName="text-sm"
                  />
                  <FormField
                    type="number"
                    placeholder="Max Sqft"
                    value={filters.maxSqft || ""}
                    onChange={(e) => handleFilterChange("maxSqft", e.target.value)}
                    inputClassName="text-sm"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                onClick={onClear}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
</div>
          </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default PropertyFilters