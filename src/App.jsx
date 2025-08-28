import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import HomePage from "@/components/pages/HomePage"
import PropertyDetail from "@/components/pages/PropertyDetail"
import SavedPropertiesPage from "@/components/pages/SavedPropertiesPage"
import MapPage from "@/components/pages/MapPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-body">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/saved" element={<SavedPropertiesPage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App