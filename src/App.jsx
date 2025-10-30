import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { router } from "@/router"
function App() {
  return (
    <>
      <div className="min-h-screen bg-background font-body">
        <RouterProvider router={router} />
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
    </>
  )
}

export default App