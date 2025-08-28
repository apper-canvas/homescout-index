import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Oops! Something went wrong"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" size={32} className="text-white" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </Button>
      )}
      
      <div className="mt-4">
        <Button
          variant="ghost"
          onClick={() => window.location.href = "/"}
          className="text-primary-600"
        >
          Back to Home
        </Button>
      </div>
    </motion.div>
  )
}

export default Error