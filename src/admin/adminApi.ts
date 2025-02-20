import { Club, ClubDetails } from "../types/club"

const API_BASE_URL = "https://localhost:53166/api/Auth/admin"
const API_CLUB_BASE_URL = "https://localhost:53166/api/Auth"

export const clubsApi = {
  getClubs: async (): Promise<Club[]> => {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) throw new Error("Failed to fetch clubs")
    return response.json()
  },

  getClubDetails: async (id: number): Promise<ClubDetails> => {
    const response = await fetch(`${API_CLUB_BASE_URL}/clubs/${id}`)
    if (!response.ok) throw new Error("Failed to fetch club details")
    return response.json()
  },

  approveClubs: async (ids: number[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/approve-clubs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
    if (!response.ok) throw new Error("Failed to approve clubs")
  },

  revertClub: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/revert-club/${id}/`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("Failed to revert club")
  },

  deleteClub: async (id: number): Promise<void> => {
    const response = await fetch(`${API_CLUB_BASE_URL}/clubs/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete club")
  },
}
