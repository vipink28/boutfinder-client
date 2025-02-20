import { X } from "lucide-react"
import { ClubDetails } from "../types/club"

interface Props {
  club: ClubDetails | null
  onClose: () => void
}
const ClubDetailsModal = ({ club, onClose }: Props) => {
  if (!club) return null
  const {
    cfoEmail,
    cfoName,
    clubAddress,
    clubName,
    clubLogo,
    clubPrimaryContactName,
    clubPrimaryContactNumber,
    clubRegion,
    cmmContactNumber,
    cmmEmail,
    cmmName,
    postcode,
  } = club
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{clubName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Contact Information</h3>
            <p>Primary Contact Name: {clubPrimaryContactName}</p>
            <p>Primary Contact Number: {clubPrimaryContactNumber}</p>
            <p>Club Region: {clubRegion}</p>
            <p>Postcode: {postcode}</p>
            <p>Club Address: {clubAddress}</p>
            <p>CFO Name: {cfoName}</p>
            <p>CFO Email: {cfoEmail}</p>
            <p>CMM Name: {cmmName}</p>
            <p>CMM Email: {cmmEmail}</p>
            <p>CMM Contact: {cmmContactNumber}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubDetailsModal
