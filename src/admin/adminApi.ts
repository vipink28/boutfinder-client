import axios from "axios"

const API_BASE_URL = "https://localhost:53166/api/Auth/admin"
const API_CLUB_BASE_URL = "https://localhost:53166/api/Auth"
const config = (
  token: string | null,
  pageNumber: number = 1,
  pageSize: number = 20,
) => ({
  params: {
    pageNumber,
    pageSize,
  },
  headers: { Authorization: `Bearer ${token}` },
})

const postConfig = (token: string | null) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const clubsApi = {
  getClubs: async (
    token: string | null,
    pageNumber?: number,
    pageSize?: number,
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users`,
        config(token, pageNumber, pageSize),
      )
      if (response.status === 400) throw new Error("Failed to fetch clubs")
      return response.data
    } catch (err) {
      console.log(err)
    }
  },

  approveClubs: async (ids: number[], token: string | null): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/approve-clubs`,
        ids,
        postConfig(token),
      )
      if (response.status === 400) throw new Error("Failed to fetch clubs")
      return response.data
    } catch (err) {
      console.log(err)
    }
  },

  approveSingleClub: async (
    ids: number[],
    token: string | null,
  ): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/approve-clubs`,
        ids,
        postConfig(token),
      )
      if (response.status === 400) throw new Error("Failed to fetch clubs")
      return response.data
    } catch (err) {
      console.log(err)
    }
  },

  revertClub: async (ids: number[], token: string | null): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/revert-clubs`,
        ids,
        postConfig(token),
      )
      if (response.status === 400) throw new Error("Failed to fetch clubs")
      return response.data
    } catch (err) {
      console.log(err)
    }
  },

  deleteClub: async (id: number): Promise<void> => {
    const response = await fetch(`${API_CLUB_BASE_URL}/clubs/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete club")
  },
}
