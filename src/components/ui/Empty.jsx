import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No results found",
  message = "Try adjusting your search or filters.",
  actionText = "Browse All Properties",
  onAction,
  icon = "SearchX"
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary-500" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Search" size={12} className="text-white" />
        </motion.div>
      </motion.div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={handleAction}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Home" size={18} />
          {actionText}
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => window.location.href = "/map"}
          className="flex items-center gap-2 text-primary-600"
        >
          <ApperIcon name="Map" size={16} />
          Explore Map View
        </Button>
      </div>
    </motion.div>
  )
}

export default Empty