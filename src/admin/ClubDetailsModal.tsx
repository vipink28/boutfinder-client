import { X } from "lucide-react"
import { ClubDetails } from "../types/club"

interface Props {
  club: ClubDetails | null
  onClose: () => void
}
const ClubDetailsModal = ({ club, onClose }: Props) => {
  if (!club) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{club.clubName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Contact Information</h3>
            <p>Email: {club.email}</p>
            <p>Phone: {club.phone || "N/A"}</p>
          </div>

          <div>
            <h3 className="font-semibold">Club Details</h3>
            <p>Status: {club.status}</p>
            <p>Email Verification: {club.emailVerified}</p>
            <p>Member Count: {club.memberCount || "N/A"}</p>
            <p>Created: {new Date(club.createdDate).toLocaleDateString()}</p>
          </div>

          {club.description && (
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{club.description}</p>
            </div>
          )}

          {club.address && (
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>{club.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubDetailsModal
