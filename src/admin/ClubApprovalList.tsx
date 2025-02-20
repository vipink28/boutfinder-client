import { AlertTriangle, Check, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Club, ClubDetails } from "../types/club"

import { clubsApi } from "./adminApi"
import ClubDetailsModal from "./ClubDetailsModal"

const ClubApprovalList = () => {
  const [clubs, setClubs] = useState<Club[]>([])
  const [selectedClubs, setSelectedClubs] = useState<number[]>([])
  const [selectedClubDetails, setSelectedClubDetails] =
    useState<ClubDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClubs()
  }, [])

  const loadClubs = async () => {
    try {
      const data = await clubsApi.getClubs()
      setClubs(data)
    } catch (err) {
      setError("Failed to load clubs")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (id: number) => {
    try {
      const details = await clubsApi.getClubDetails(id)
      setSelectedClubDetails(details)
    } catch (err) {
      setError("Failed to load club details")
    }
  }

  const handleApproveSelected = async () => {
    try {
      await clubsApi.approveClubs(selectedClubs)
      await loadClubs()
      setSelectedClubs([])
    } catch (err) {
      setError("Failed to approve selected clubs")
    }
  }

  const handleRevert = async (id: number) => {
    try {
      await clubsApi.revertClub(id)
      await loadClubs()
    } catch (err) {
      setError("Failed to revert club")
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        await clubsApi.deleteClub(id)
        await loadClubs()
      } catch (err) {
        setError("Failed to delete club")
      }
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  return (
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
                    setSelectedClubs(
                      e.target.checked ? clubs.map(club => club.id) : [],
                    )
                  }}
                  checked={selectedClubs.length === clubs.length}
                />
              </th>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Club Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Stripe Customer ID</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Email Verified</th>
              <th className="px-4 py-2 text-left">Created Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map(club => (
              <tr
                key={club.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedClubs.includes(club.id)}
                    onChange={e => {
                      setSelectedClubs(
                        e.target.checked
                          ? [...selectedClubs, club.id]
                          : selectedClubs.filter(id => id !== club.id),
                      )
                    }}
                  />
                </td>
                <td className="px-4 py-2">{club.id}</td>
                <td className="px-4 py-2">{club.clubName}</td>
                <td className="px-4 py-2">{club.email}</td>
                <td className="px-4 py-2">{club.stripeCustomerId}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      club.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {club.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      club.emailVerified === "Verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {club.emailVerified}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(club.createdDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(club.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </button>
                    {club.status === "Pending" ? (
                      <button
                        onClick={() => handleApproveSelected()}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevert(club.id)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(club.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClubDetails && (
        <ClubDetailsModal
          club={selectedClubDetails}
          onClose={() => setSelectedClubDetails(null)}
        />
      )}
    </div>
  )
}

export default ClubApprovalList
