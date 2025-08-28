import { useState } from "react"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search properties...", 
  className 
}) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex", className)}>
      <div className="relative flex-1">
        <ApperIcon
          name="Search"
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 rounded-r-none border-r-0 focus:border-primary-500"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        className="rounded-l-none px-6 shadow-none"
      >
        Search
      </Button>
    </form>
  )
}

export default SearchBar