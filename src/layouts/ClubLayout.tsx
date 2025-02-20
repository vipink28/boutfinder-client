import { Outlet } from "react-router"
import Navbar from "../components/global/Navbar"

const ClubLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}

export default ClubLayout
