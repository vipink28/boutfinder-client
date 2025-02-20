import {
  Building2,
  ImagePlus,
  MapPin,
  Shield,
  UserCog,
  Users,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { useLazyGetUserStatusQuery } from "../../api/authApi"
import { useCreateClubMutation } from "../../api/clubApi"
import { RootState } from "../../app/store"
import Section from "../../components/club/Section"
import { setCredentials } from "../../features/auth/authSlice"
import { postCodeLookup } from "../../utils/postcodeLookup"

interface ClubFormData {
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
  clubLogo?: FileList
}

const ClubRegistration = () => {
  const [addresses, setAddresses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [createClub, { isLoading, isError, error }] = useCreateClubMutation()
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()
  const userId = useSelector((state: any) => state.auth.user?.userId)
  const [fetchUserStatus] = useLazyGetUserStatusQuery()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.auth.token)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ClubFormData>()

  const handlePostcodeBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const postcode = e.target.value.trim()
    if (postcode.length < 5) return // Avoid unnecessary API calls

    setLoading(true)
    clearErrors("postcode") // Clear previous errors

    try {
      const fetchedAddresses = await postCodeLookup(postcode)
      setAddresses(fetchedAddresses)
    } catch (error: any) {
      setError("postcode", { type: "manual", message: error.message })
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    setApiError(null)
    const formData = new FormData()
    formData.append("ClubName", data.clubName)
    formData.append("ClubRegion", data.clubRegion)
    formData.append("Postcode", data.postcode)
    formData.append("ClubAddress", data.clubAddress)
    formData.append("ClubPrimaryContactName", data.clubPrimaryContactName)
    formData.append("ClubPrimaryContactNumber", data.clubPrimaryContactNumber)
    formData.append("CfoName", data.cfoName)
    formData.append("CfoEmail", data.cfoEmail)
    formData.append("CmmName", data.cmmName)
    formData.append("CmmEmail", data.cmmEmail)
    formData.append("CmmContactNumber", data.cmmContactNumber)
    formData.append("UserId", userId)
    if (data.clubLogo[0]) {
      formData.append("ClubLogo", data.clubLogo[0])
    }

    try {
      const response = await createClub(formData).unwrap()
      if (response.status) {
        alert("Club successfully registered!")
        const updatedUserStatus = await fetchUserStatus().unwrap()
        const userStatus = updatedUserStatus

        dispatch(setCredentials({ token, user: userStatus })) // Update Redux state

        if (userStatus?.clubId) {
          navigate("/membership-status") // Redirect if clubId exists
        }
        if (updatedUserStatus.clubId) {
          navigate("/membership-status") // Redirect after fetching updated status
        }
      }
    } catch (err: any) {
      console.error("Error creating club:", err)
      setApiError(err.data?.message || "Failed to register club")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-xl font-medium mb-2">
          Club Membership Registration
        </h1>
        <p className="text-sm text-gray-600">
          Each registration is vetted by Bout Finder. Until approved neither
          clubs nor boxers will appear in any search results.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Club Information */}
        <Section
          title="Club Information"
          icon={<Building2 className="w-5 h-5 text-primary-500" />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Club Name
              </label>
              <input
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Longside Boxing Club"
                {...register("clubName", { required: "Club Name is required" })}
              />
              {errors.clubName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.clubName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Region</label>
              <select
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                {...register("clubRegion", { required: "Region is required" })}
              >
                <option value="">Select a region</option>
                <option value="East Midlands">East Midlands</option>
                <option value="Eastern Counties">Eastern Counties</option>
                <option value="Home Counties">Home Counties</option>
                <option value="London">London</option>
                <option value="Merseyside and Cheshire">
                  Merseyside and Cheshire
                </option>
                <option value="Midlands">Midlands</option>
                <option value="North West">North West</option>
                <option value="Police">Police</option>
                <option value="Royal Air Force (RAF)">
                  Royal Air Force (RAF)
                </option>
                <option value="Royal Navy">Royal Navy</option>
                <option value="Southern Counties">Southern Counties</option>
                <option value="Tyne, Tees, and Wear">
                  Tyne, Tees, and Wear
                </option>
                <option value="Western Counties">Western Counties</option>
                <option value="Yorkshire">Yorkshire</option>
              </select>
              {errors.clubRegion && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.clubRegion.message}
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* Location */}
        <Section
          title="Location"
          icon={<MapPin className="w-5 h-5 text-primary-500" />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Gym Postcode
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Enter postcode"
                {...register("postcode", {
                  required: "Postcode is required",
                  onBlur: handlePostcodeBlur,
                })}
              />
              {errors.postcode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.postcode.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Select gym address
              </label>
              <select
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                {...register("clubAddress")}
              >
                {loading ? (
                  <option disabled>Loading addresses...</option>
                ) : (
                  addresses.map((addr, index) => (
                    <option key={index} value={addr}>
                      {addr}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </Section>

        {/* Primary Contact */}
        <Section
          title="Primary Contact"
          icon={<Users className="w-5 h-5 text-primary-500" />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Main club contact
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Enter main contact name"
                {...register("clubPrimaryContactName", {
                  required: "Main contact is required",
                })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Club phone
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                {...register("clubPrimaryContactNumber", {
                  required: "Main contact is required",
                })}
                placeholder="Enter club number"
              />
            </div>
          </div>
        </Section>

        {/* Club Welfare Officer */}
        <Section
          title="Club Welfare Officer"
          icon={<Shield className="w-5 h-5 text-primary-500" />}
          description="The CWO's primary responsibility is to support the safeguarding and protection of children and young people. They should be DBS (CRB) checked and be registered with England Boxing."
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Club Welfare Officer Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Officer Name"
                {...register("cfoName")}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Club Welfare Officer Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Club Welfare officer Email"
                {...register("cfoEmail")}
              />
            </div>
          </div>
        </Section>

        {/* Matchmaker */}
        <Section
          title="Club Matchmaker"
          icon={<UserCog className="w-5 h-5 text-primary-500" />}
          description="The matchmaker is the person in charge of arranging bouts between boxers. All communication will be sent to the matchmakers email or phone."
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Matchmaker Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Matchmaker name"
                {...register("cmmName")}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Matchmaker Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Matchmaker email"
                {...register("cmmEmail")}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Matchmaker Mobile Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded p-2.5 text-sm"
                placeholder="Matchmaker phone number"
                {...register("cmmContactNumber")}
              />
            </div>
          </div>
        </Section>

        {/* Club Logo */}
        <Section
          title="Club Logo"
          icon={<ImagePlus className="w-5 h-5 text-primary-500" />}
        >
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (max. 800x800px)
                </p>
              </div>
              <input
                {...register("clubLogo")}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </label>
          </div>
        </Section>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            type="submit"
            className="w-full bg-primary-500 text-white rounded py-3 text-sm font-medium hover:bg-primary-500/90 transition-colors"
          >
            Complete Registration
          </button>
        </div>
        {/* API Error Message */}
        {apiError && <p className="text-red-500 text-xs mt-2">{apiError}</p>}
      </form>
    </div>
  )
}

export default ClubRegistration
