import propertiesData from "../mockData/properties.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getAllProperties = async () => {
  await delay(300)
  return [...propertiesData]
}

export const getPropertyById = async (id) => {
  await delay(200)
  const property = propertiesData.find(p => p.Id === id)
  if (!property) {
    throw new Error("Property not found")
  }
  return { ...property }
}

export const searchProperties = async (searchTerm) => {
  await delay(400)
  if (!searchTerm) return [...propertiesData]
  
  const term = searchTerm.toLowerCase()
  return propertiesData.filter(property =>
    property.title?.toLowerCase().includes(term) ||
    property.address?.toLowerCase().includes(term) ||
    property.city?.toLowerCase().includes(term) ||
    property.state?.toLowerCase().includes(term) ||
    property.propertyType?.toLowerCase().includes(term)
  )
}

export const filterProperties = async (filters) => {
  await delay(350)
  let filtered = [...propertiesData]
  
  if (filters.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice)
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice)
  }
  
  if (filters.propertyType) {
    filtered = filtered.filter(p => p.propertyType === filters.propertyType)
  }
  
  if (filters.minBeds) {
    filtered = filtered.filter(p => p.bedrooms >= filters.minBeds)
  }
  
  if (filters.minBaths) {
    filtered = filtered.filter(p => p.bathrooms >= filters.minBaths)
  }
  
  return filtered
}

export const createProperty = async (propertyData) => {
  await delay(500)
  const maxId = Math.max(...propertiesData.map(p => p.Id))
  const newProperty = {
    ...propertyData,
    Id: maxId + 1,
    listingDate: new Date().toISOString().split("T")[0]
  }
  propertiesData.push(newProperty)
  return { ...newProperty }
}

export const updateProperty = async (id, propertyData) => {
  await delay(400)
  const index = propertiesData.findIndex(p => p.Id === id)
  if (index === -1) {
    throw new Error("Property not found")
  }
  
  propertiesData[index] = { ...propertiesData[index], ...propertyData }
  return { ...propertiesData[index] }
}

export const deleteProperty = async (id) => {
  await delay(300)
  const index = propertiesData.findIndex(p => p.Id === id)
  if (index === -1) {
    throw new Error("Property not found")
  }
  
  const deleted = propertiesData.splice(index, 1)[0]
  return { ...deleted }
}