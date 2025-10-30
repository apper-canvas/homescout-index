import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="text-center space-y-6 p-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 mb-4">
          <ApperIcon name="Home" size={48} className="text-primary-600" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-primary-900">404</h1>
        
        <h2 className="text-2xl font-display font-semibold text-primary-800">
          Page Not Found
        </h2>
        
        <p className="text-lg text-primary-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to finding your dream home.
        </p>
        
        <Button
          onClick={() => navigate("/")}
          className="mt-8 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <ApperIcon name="Home" size={20} className="mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;