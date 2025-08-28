import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ViewToggle = ({ view, onViewChange, className }) => {
  const views = [
    { key: "grid", icon: "Grid3X3", label: "Grid" },
    { key: "list", icon: "List", label: "List" },
    { key: "map", icon: "Map", label: "Map" }
  ]

  return (
    <div className={cn("flex bg-gray-100 rounded-lg p-1", className)}>
      {views.map((viewOption) => (
        <Button
          key={viewOption.key}
          size="sm"
          variant={view === viewOption.key ? "primary" : "ghost"}
          onClick={() => onViewChange(viewOption.key)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200",
            view === viewOption.key 
              ? "bg-white shadow-sm text-primary-700" 
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <ApperIcon name={viewOption.icon} size={16} />
          <span className="hidden sm:inline">{viewOption.label}</span>
        </Button>
      ))}
    </div>
  )
}

export default ViewToggle