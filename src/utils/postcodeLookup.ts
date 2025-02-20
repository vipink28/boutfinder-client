const API_KEY = "ak_lhyvhaovxYiwuG319WGOrQRHmcApy" // Replace with your actual API key

export const postCodeLookup = async (postcode: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://api.ideal-postcodes.co.uk/v1/postcodes/${postcode}?api_key=${API_KEY}`,
    )
    const data = await response.json()

    if (!data.result || data.result.length === 0) {
      throw new Error("Invalid postcode")
    }

    return data.result.map((addr: any) => addr.line_1 + ", " + addr.post_town)
  } catch (error) {
    throw new Error("Error fetching addresses")
  }
}
