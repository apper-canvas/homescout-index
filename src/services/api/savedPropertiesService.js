import savedPropertiesData from "../mockData/savedProperties.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getSavedProperties = async () => {
  await delay(200)
  return [...savedPropertiesData]
}

export const getSavedPropertyById = async (id) => {
  await delay(150)
  const saved = savedPropertiesData.find(s => s.Id === id)
  if (!saved) {
    throw new Error("Saved property not found")
  }
  return { ...saved }
}

export const addSavedProperty = async (propertyId, notes = "") => {
  await delay(300)
  
  // Check if already saved
  const existing = savedPropertiesData.find(s => s.propertyId === propertyId)
  if (existing) {
    throw new Error("Property already saved")
  }
  
  const maxId = savedPropertiesData.length > 0 
    ? Math.max(...savedPropertiesData.map(s => s.Id)) 
    : 0
  
  const newSaved = {
    Id: maxId + 1,
    propertyId: propertyId,
    savedDate: new Date().toISOString().split("T")[0],
    notes: notes
  }
  
  savedPropertiesData.push(newSaved)
  return { ...newSaved }
}

export const removeSavedProperty = async (propertyId) => {
  await delay(250)
  const index = savedPropertiesData.findIndex(s => s.propertyId === propertyId)
  if (index === -1) {
    throw new Error("Saved property not found")
  }
  
  const removed = savedPropertiesData.splice(index, 1)[0]
  return { ...removed }
}

export const toggleSavedProperty = async (propertyId) => {
  await delay(300)
  const existing = savedPropertiesData.find(s => s.propertyId === propertyId)
  
  if (existing) {
    // Remove if exists
    const index = savedPropertiesData.findIndex(s => s.propertyId === propertyId)
    const removed = savedPropertiesData.splice(index, 1)[0]
    return { action: "removed", property: { ...removed } }
  } else {
    // Add if doesn't exist
    const maxId = savedPropertiesData.length > 0 
      ? Math.max(...savedPropertiesData.map(s => s.Id)) 
      : 0
    
    const newSaved = {
      Id: maxId + 1,
      propertyId: propertyId,
      savedDate: new Date().toISOString().split("T")[0],
      notes: ""
    }
    
    savedPropertiesData.push(newSaved)
    return { action: "added", property: { ...newSaved } }
  }
}

export const updateSavedPropertyNotes = async (id, notes) => {
  await delay(200)
  const index = savedPropertiesData.findIndex(s => s.Id === id)
  if (index === -1) {
    throw new Error("Saved property not found")
  }
  
  savedPropertiesData[index].notes = notes
  return { ...savedPropertiesData[index] }
}

export const clearAllSavedProperties = async () => {
  await delay(400)
  const cleared = [...savedPropertiesData]
  savedPropertiesData.length = 0
  return cleared
}