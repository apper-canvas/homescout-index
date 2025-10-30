import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { formatPrice, formatSquareFeet, formatDate } from "@/utils/formatters"
import { getPropertyById } from "@/services/api/propertiesService"
import { getSavedProperties, toggleSavedProperty } from "@/services/api/savedPropertiesService"
import { toast } from "react-toastify"

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState(new Set())
const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    loadProperty()
    checkIfSaved()
  }, [id])

  const loadProperty = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await getPropertyById(parseInt(id))
      setProperty(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkIfSaved = async () => {
    try {
      const saved = await getSavedProperties()
      setIsSaved(saved.some(item => item.propertyId === parseInt(id)))
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const handleToggleSave = async () => {
    try {
      await toggleSavedProperty(parseInt(id))
      setIsSaved(!isSaved)
      toast.success(isSaved ? "Property removed from saved list" : "Property saved to your list")
    } catch (error) {
      console.error("Error toggling saved property:", error)
      toast.error("Failed to update saved properties")
    }
  }

  const handleImageError = (index) => {
    setImageErrors(prev => new Set(prev).add(index))
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

const handleContactAgent = () => {
    setShowContactForm(true)
  }

  const handleContactFormChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitContact = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!contactForm.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!contactForm.email.trim() || !contactForm.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!contactForm.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    if (!contactForm.message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowContactForm(false)
      setContactForm({ name: '', email: '', phone: '', message: '' })
      toast.success('Your message has been sent to the agent!')
    }, 1500)
  }

  const handleCloseModal = () => {
    setShowContactForm(false)
    setContactForm({ name: '', email: '', phone: '', message: '' })
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProperty} />
  if (!property) return <Error message="Property not found" />

  const validImages = property.images?.filter((_, index) => !imageErrors.has(index)) || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              Back to Search
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isSaved ? "accent" : "outline"}
                onClick={handleToggleSave}
                className="flex items-center gap-2"
              >
                <ApperIcon 
                  name="Heart" 
                  size={18} 
                  className={isSaved ? "fill-current" : ""} 
                />
                {isSaved ? "Saved" : "Save"}
              </Button>
              
              <Button variant="ghost" className="p-2">
                <ApperIcon name="Share" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              {validImages.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="relative h-96 lg:h-[500px] bg-gray-100">
                    <img
                      src={validImages[currentImageIndex] || "/api/placeholder/800/500"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(currentImageIndex)}
                    />
                    
                    {/* Navigation Buttons */}
                    {validImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                          disabled={currentImageIndex === 0}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg"
                        >
                          <ApperIcon name="ChevronLeft" size={20} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentImageIndex(Math.min(validImages.length - 1, currentImageIndex + 1))}
                          disabled={currentImageIndex === validImages.length - 1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg"
                        >
                          <ApperIcon name="ChevronRight" size={20} />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    {validImages.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {validImages.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {validImages.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex gap-2 overflow-x-auto">
                        {validImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all duration-200 ${
                              index === currentImageIndex 
                                ? "border-primary-500 scale-105" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${property.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 lg:h-[500px] flex items-center justify-center bg-gray-100">
                  <ApperIcon name="Home" size={64} className="text-gray-400" />
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-700 mb-2">
                    {formatPrice(property.price)}
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h2>
                </div>
                <Badge variant={getStatusColor(property.status)}>
                  {property.status || "For Sale"}
                </Badge>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <ApperIcon name="MapPin" size={18} />
                <span>
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </span>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Bed" size={24} className="text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Bath" size={24} className="text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Square" size={24} className="text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{formatSquareFeet(property.squareFeet)}</div>
                  <div className="text-sm text-gray-600">Square Feet</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Calendar" size={24} className="text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.yearBuilt || "N/A"}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Property Type */}
              <div className="flex items-center gap-2 text-secondary-600 mb-6">
                <ApperIcon name="Home" size={18} />
                <span className="capitalize font-medium">{property.propertyType}</span>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">About This Property</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}
            </motion.div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-lg"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg sticky top-32"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Interested in this property?</h3>
              
              <div className="space-y-3 mb-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleContactAgent}
                >
                  <ApperIcon name="MessageCircle" size={18} className="mr-2" />
                  Contact Agent
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Virtual tour feature coming soon!")}
                >
                  <ApperIcon name="Video" size={18} className="mr-2" />
                  Virtual Tour
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Schedule viewing feature coming soon!")}
                >
                  <ApperIcon name="Calendar" size={18} className="mr-2" />
                  Schedule Viewing
                </Button>
              </div>

              {/* Property Stats */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">Listed on</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(property.listingDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-medium text-gray-900">#{property.Id}</span>
                </div>
              </div>
            </motion.div>
          </div>
</div>
      </div>

      {/* Contact Agent Modal */}
      {showContactForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold text-white">
                  Contact Agent
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Close modal"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              <p className="text-primary-100 mt-2">
                Get in touch about {property?.address}
              </p>
            </div>

            <form onSubmit={handleSubmitContact} className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={contactForm.phone}
                  onChange={handleContactFormChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">
                  Message *
                </Label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="I'm interested in this property and would like to schedule a viewing..."
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ApperIcon name="Send" size={16} />
                      Send Message
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail