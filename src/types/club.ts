export interface ClubData {
  totalCount: number
  pageNumber: number
  pageSize: number
  users: ClubUser[]
}

export interface ClubUser {
  userId: number
  username: string
  email: string
  stripeCustomerId: string | null
  clubId: number
  isClubApproved: boolean
  createdAt: string
  clubDetails: ClubDetails
  clubName: ClubDetails["clubName"]
}
export interface ClubDetails extends ClubUser {
  clubName: string
  clubRegion: string
  postcode: string
  clubAddress: string
  clubPrimaryContactName: string
  clubPrimaryContactNumber: string
  cfoName: string
  cfoEmail: string
  cmmName: string
  cmmEmail: string
  cmmContactNumber: string
  clubLogo?: string
}
