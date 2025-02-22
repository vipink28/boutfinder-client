import {
  Check,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  Eye,
  Menu,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import Loading from "../components/global/Loading"
import { ClubData, ClubDetails } from "../types/club"
import { clubsApi } from "./adminApi"
import ClubDetailsModal from "./ClubDetailsModal"

const AdminDashboard = () => {
  const [clubs, setClubs] = useState<ClubData>({
    totalCount: 1,
    pageNumber: 1,
    pageSize: 1,
    users: [],
  })
  const [selectedClubs, setSelectedClubs] = useState<number[]>([])
  const [selectedClubDetails, setSelectedClubDetails] =
    useState<ClubDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem("token")
  const [dropdown, setDropdown] = useState(false)

  const nonApprovedClubs = clubs.users.filter(club => !club.isClubApproved)
  const areAllNonApprovedSelected =
    nonApprovedClubs.length > 0 &&
    nonApprovedClubs.every(club => selectedClubs.includes(club.userId))

  //calculate pages
  const totalPages = Math.ceil(clubs.totalCount / clubs.pageSize)
  const currentPage = clubs.pageNumber

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 8
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  useEffect(() => {
    if (token) {
      loadClubs(token)
    }
  }, [token])

  const loadClubs = async (
    token: string | null,
    pageNumber: number = 1,
    pageSize: number = 20,
  ) => {
    try {
      const data = await clubsApi.getClubs(token, pageNumber, pageSize)
      setClubs(data)
    } catch (err) {
      setError("Failed to load clubs")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadClubs(token, page, clubs.pageSize)
    }
  }

  const handleViewDetails = async (id: number) => {
    const details = clubs.users.find(x => x.userId === id)
    setSelectedClubDetails(details?.clubDetails || null)
  }

  const handleApproveSelected = async () => {
    try {
      await clubsApi.approveClubs(selectedClubs, token)
      await loadClubs(token)
      setSelectedClubs([])
    } catch (err) {
      setError("Failed to approve selected clubs")
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await clubsApi.approveClubs([id], token)
      await loadClubs(token)
      setSelectedClubs([])
    } catch (err) {
      setError("Failed to approve selected clubs")
    }
  }

  const handleRevert = async (id: number) => {
    try {
      await clubsApi.revertClub([id], token)
      await loadClubs(token)
    } catch (err) {
      setError("Failed to revert club")
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        await clubsApi.deleteClub(id)
        await loadClubs(token)
      } catch (err) {
        setError("Failed to delete club")
      }
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-b-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-black font-montserrat text-2xl">
              <span className="text-primary-500">BOUT</span>
              <span className="text-gray-900">FINDER</span>
            </h1>
            <div className="relative">
              <button
                onClick={() => {
                  setDropdown(!dropdown)
                }}
                className="p-2"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div
                className={`flex-col min-w-48 text-right bg-white absolute right-0 -bottom-12 ${
                  dropdown ? "flex" : "hidden"
                }`}
              >
                <span className="p-3.5 cursor-pointer">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        {selectedClubs.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleApproveSelected}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Approve Selected ({selectedClubs.length})
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={e => {
                      const nonApprovedUserIds = nonApprovedClubs.map(
                        club => club.userId,
                      )
                      setSelectedClubs(
                        e.target.checked ? nonApprovedUserIds : [],
                      )
                    }}
                    checked={areAllNonApprovedSelected}
                  />
                </th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Club Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Stripe Customer ID</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.users?.map(
                ({
                  userId,
                  clubName,
                  email,
                  stripeCustomerId,
                  isClubApproved,
                  createdAt,
                  clubId,
                }) => (
                  <tr
                    key={userId}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedClubs.includes(userId)}
                        onChange={e => {
                          setSelectedClubs(
                            e.target.checked
                              ? [...selectedClubs, userId]
                              : selectedClubs.filter(id => id !== userId),
                          )
                        }}
                        disabled={isClubApproved}
                      />
                    </td>
                    <td className="px-4 py-2">{userId}</td>
                    <td className="px-4 py-2">{clubName}</td>
                    <td className="px-4 py-2">{email}</td>
                    <td className="px-4 py-2">{stripeCustomerId}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          isClubApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {isClubApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(userId)}
                          className="bg-blue-500 hover:bg-blue-700 cursor-pointer flex gap-2 items-center text-white py-2.5 px-4 font-medium"
                        >
                          <Eye className="h-5 w-5" />
                          View
                        </button>
                        {!isClubApproved ? (
                          <button
                            onClick={() => handleApprove(userId)}
                            className="bg-green-500 hover:bg-green-700 cursor-pointer flex gap-2 items-center text-white py-2.5 px-4 font-medium"
                          >
                            <Check className="h-5 w-5" />
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevert(userId)}
                            className="bg-orange-600 hover:bg-orange-700 cursor-pointer  flex gap-2 items-center text-white py-2.5 px-4 font-medium"
                          >
                            <CornerUpLeft className="h-5 w-5" />
                            Revert
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(clubId)}
                          className="bg-red-500 hover:bg-red-700 flex gap-2 cursor-pointer items-center text-white py-2.5 px-4 font-medium"
                        >
                          <Trash2 className="h-5 w-5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {selectedClubDetails && (
          <ClubDetailsModal
            club={selectedClubDetails}
            onClose={() => setSelectedClubDetails(null)}
          />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
