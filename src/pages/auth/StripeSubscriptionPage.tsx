import { useEffect } from "react"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { useCreateSubscriptionMutation } from "../../api/authApi"
import { RootState } from "../../app/store"
import { getEmailFromToken } from "../../utils/authUtils"

const StripeSubscriptionPage = () => {
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.token)
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  )
  const user = useSelector((state: RootState) => state.auth.user)
  const [createSubscription, { isLoading, error }] =
    useCreateSubscriptionMutation()

  // const priceTableId = "prctbl_1QtCMWIHT6zjJyD5GTcSdxoj"
  const priceTableId = "price_1QtCDyIHT6zjJyD5s00gEF7X"
  const priceId = "price_1QtCDyIHT6zjJyD5s00gEF7X"
  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login")
      return
    }

    // Check if user already has an active subscription
    if (user?.isMemberActive && user?.stripeSubscriptionId) {
      navigate("/add-club")
      return
    }

    const email = getEmailFromToken(token)
    if (!email) {
      console.error("Could not extract email from token")
      navigate("/login")
      return
    }

    // If user has no active subscription, create a new one
    createSubscription({ email, priceId })
      .unwrap()
      .then(response => {
        if (response.url) {
          // window.location.href = response.url // Redirect to Stripe
          console.log(response.url)
        }
      })
      .catch(err => console.error("Subscription error:", err))
  }, [isAuthenticated, token, user, createSubscription, navigate])

  if (isLoading) return <p>Redirecting to Stripe...</p>
  if (error) return <p>Failed to start subscription. Please try again.</p>

  return <div>Preparing your subscription...</div>
}

export default StripeSubscriptionPage
