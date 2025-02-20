import * as React from "react"
import { useEffect } from "react"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { useCreateSubscriptionMutation } from "../../api/authApi"
import { RootState } from "../../app/store"
import { getEmailFromToken } from "../../utils/authUtils"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

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
  const priceTableId = "prctbl_1QtCMWIHT6zjJyD5GTcSdxoj"
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
  })
  return (
    <stripe-pricing-table
      pricing-table-id="prctbl_1QtCMWIHT6zjJyD5GTcSdxoj"
      publishable-key="pk_test_51OCLLOIHT6zjJyD5L2ANg2yrJAyb5kyZKKE7EXZa71qSaMkuJOQnHSiEEh5h6T7EaRju241aFaCPROnzgYkFkLRf00z5wmpQJL"
    ></stripe-pricing-table>
  )
}

export default StripeSubscriptionPage
