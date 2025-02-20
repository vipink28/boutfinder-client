export const getEmailFromToken = (token: string | null): string | null => {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return (
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] || null
    )
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

export const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return (
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    )
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}
