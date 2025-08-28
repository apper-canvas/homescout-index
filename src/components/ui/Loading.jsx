import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Loading = ({ message = "Loading properties..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <ApperIcon name="Loader2" size={48} className="text-primary-500" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      
      <div className="w-full max-w-md space-y-4">
        {/* Property Card Skeletons */}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex space-x-4">
              <div className="w-20 h-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading