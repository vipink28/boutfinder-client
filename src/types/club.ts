export interface Club {
  id: number
  clubName: string
  email: string
  stripeCustomerId: string
  status: "Approved" | "Pending"
  emailVerified: "Verified" | "Pending"
  createdDate: string
}

export interface ClubDetails extends Club {
  // Additional details that come from the server
  address?: string
  phone?: string
  description?: string
  memberCount?: number
}
