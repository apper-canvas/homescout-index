export const formatPrice = (price) => {
  if (typeof price !== "number") return "Price not available"
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatSquareFeet = (sqft) => {
  if (typeof sqft !== "number") return "N/A"
  
  return new Intl.NumberFormat("en-US").format(sqft) + " sq ft"
}

export const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatBedsBaths = (beds, baths) => {
  const bedText = beds === 1 ? "bed" : "beds"
  const bathText = baths === 1 ? "bath" : "baths"
  
  return `${beds} ${bedText}, ${baths} ${bathText}`
}

export const capitalizeFirst = (str) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}