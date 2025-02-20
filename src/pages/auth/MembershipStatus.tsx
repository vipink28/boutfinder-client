import { CheckCircle, Clock, Menu } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

const MembershipStatus = () => {
  const [dropdown, setDropdown] = useState(false)

  let status = "pending"
  let clubName = "myclub"
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-b-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-black font-montserrat text-2xl">
              <span className="text-primary-500">BOUT</span>
              <span className="text-gray-900">FINDER</span>
            </h1>
            <div className="relative">
              <button
                onClick={() => {
                  setDropdown(!dropdown)
                }}
                className="p-2"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div
                className={`flex-col min-w-48 text-right bg-white absolute right-0 -bottom-12 ${
                  dropdown ? "flex" : "hidden"
                }`}
              >
                <span className="p-3.5 cursor-pointer">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Membership - {status === "approved" ? "Approved" : "Status"}
          </h2>

          {status === "pending" ? (
            <>
              <div className="flex items-center gap-3 text-amber-600 mb-6">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Registration Status</span>
              </div>

              <p className="text-gray-600 mb-8">
                Each registration is vetted by Bout Finder. Until approved, your
                club details will remain on our records. We will send an email
                to your registered email account, once approved, this may up to
                24 hours.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Club Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {clubName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Registration Status
                  </label>
                  <div className="text-primary-500 font-medium">
                    Awaiting Approval
                  </div>
                </div>
                {/* 
                {onShowApproved && (
                  <button
                    onClick={onShowApproved}
                    className="w-full mt-8 flex items-center justify-center gap-2 py-3 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Show approval page</span>
                  </button>
                )} */}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-green-600 mb-6">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Membership Approved</span>
              </div>

              <p className="text-gray-600 mb-8">
                We are pleased to inform you that your membership has been
                successfully approved. You can now log in and start using the
                platform.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600">
                  Our Database is intended for the sole use of Club Competition
                  Secretaries or their nominated Password holders for the
                  purposes of Matchmaking only. Mis-use of any information
                  including e-mail addresses for commercial purposes will result
                  in legal action under the Data Protection Act 1988.
                </p>
              </div>

              <Link
                to="/login"
                className="w-full bg-primary-500 text-white rounded-lg py-3 font-medium hover:bg-primary-500/90 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MembershipStatus
