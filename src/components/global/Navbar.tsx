import {
  Calendar,
  Menu,
  MessageSquare,
  Search,
  UserCircle,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import { Link, NavLink } from "react-router"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <nav className="top-0 bg-white border-b border-b-gray-50 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/club"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <h1 className="font-black font-montserrat text-2xl">
              <span className="text-primary-500">BOUT</span>
              <span className="text-gray-900">FINDER</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <NavLink
              to="/club"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-primary-500" : "text-gray-600 hover:text-primary-500"}`
              }
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </NavLink>
            <NavLink
              to="/club/my-boxers"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-primary-500" : "text-gray-600 hover:text-primary-500"}`
              }
            >
              <Users className="w-5 h-5" />
              <span>My Boxers</span>
            </NavLink>
            <NavLink
              to="/club/shows"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-primary-500" : "text-gray-600 hover:text-primary-500"}`
              }
            >
              <Calendar className="w-5 h-5" />
              <span>Shows</span>
            </NavLink>
            <NavLink
              to="/club/messages"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-primary-500" : "text-gray-600 hover:text-primary-500"}`
              }
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </NavLink>
            <NavLink
              to="/club/account"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-primary-500" : "text-gray-600 hover:text-primary-500"}`
              }
            >
              <UserCircle className="w-5 h-5" />
              <span>Account</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity sm:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform sm:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        </div>
        <div className="p-4 space-y-4">
          <NavLink
            onClick={() => {
              setIsMenuOpen(false)
            }}
            to="/club"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-primary-500/10 text-primary-500" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </NavLink>
          <NavLink
            onClick={() => {
              setIsMenuOpen(false)
            }}
            to="/club/my-boxers"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-primary-500/10 text-primary-500" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Users className="w-5 h-5" />
            <span>My Boxers</span>
          </NavLink>
          <NavLink
            onClick={() => {
              setIsMenuOpen(false)
            }}
            to="/club/shows"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-primary-500/10 text-primary-500" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Calendar className="w-5 h-5" />
            <span>Shows</span>
          </NavLink>
          <NavLink
            onClick={() => {
              setIsMenuOpen(false)
            }}
            to="/club/messages"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-primary-500/10 text-primary-500" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </NavLink>
          <NavLink
            onClick={() => {
              setIsMenuOpen(false)
            }}
            to="/club/account"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-primary-500/10 text-primary-500" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <UserCircle className="w-5 h-5" />
            <span>Account</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
