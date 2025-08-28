import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import { getSavedProperties } from "@/services/api/savedPropertiesService"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    const loadSavedCount = async () => {
      try {
        const saved = await getSavedProperties()
        setSavedCount(saved.length)
      } catch (error) {
        console.error("Error loading saved properties count:", error)
      }
    }
    loadSavedCount()
  }, [location])

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`)
    }
  }

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-primary-700">
                HomeScout
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Find Your Dream Home</p>
            </div>
          </motion.div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by location, property type..."
              className="w-full"
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 lg:gap-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Button
                variant={isActive("/") ? "primary" : "ghost"}
                onClick={() => navigate("/")}
                className="px-4 py-2"
              >
                <ApperIcon name="Search" size={18} className="mr-2" />
                Search
              </Button>
              
              <Button
                variant={isActive("/map") ? "primary" : "ghost"}
                onClick={() => navigate("/map")}
                className="px-4 py-2"
              >
                <ApperIcon name="Map" size={18} className="mr-2" />
                Map
              </Button>
            </div>

            {/* Saved Properties */}
            <Button
              variant={isActive("/saved") ? "primary" : "ghost"}
              onClick={() => navigate("/saved")}
              className="relative px-3 lg:px-4 py-2"
            >
              <ApperIcon name="Heart" size={18} className="lg:mr-2" />
              <span className="hidden lg:inline">Saved</span>
              {savedCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                >
                  {savedCount > 99 ? "99+" : savedCount}
                </motion.span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => {/* Mobile menu toggle */}}
              >
                <ApperIcon name="Menu" size={20} />
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search properties..."
            className="w-full"
          />
        </div>
      </div>
    </motion.header>
  )
}

export default Header