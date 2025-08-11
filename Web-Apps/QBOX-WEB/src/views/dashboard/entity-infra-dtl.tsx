import type React from "react"
import { useState } from "react"
import {
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Building,
  ChevronRight,
  Activity,
  GridIcon,
  TvIcon,
  FramerIcon as FridgeIcon,
  BoxIcon as QBoxIcon,
  Lock,
  Unlock,
  Camera,
  User,
  CalendarDays,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

interface InfraProperty {
  propertyName: string
  value: string
}

interface InfraDetail {
  infraSno: number
  infraIcon: string
  infraName: string
  properties: InfraProperty[]
  nextServiceDate: string | null;
}

interface InfraCount {
  infraSno: number
  infraName: string
  count: number
}

interface Props {
  getDashboardInfraList: {
    infraCounts: InfraCount[]
    infraDetails: InfraDetail[]
  },
  isFromSupervisor?: boolean;
}

const iconMap = {
  Box: GridIcon,
  Monitor: TvIcon,
  Refrigerator: FridgeIcon,
  Grid: QBoxIcon,
  Camera: Camera,
}


const EntityInfraDtl: React.FC<Props> = ({ getDashboardInfraList, isFromSupervisor = false, }) => {

  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCamera, setSelectedCamera]: any = useState(null)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [showStream, setShowStream] = useState(false)
  const navigate = useNavigate()
  const [selectedInfra, setSelectedInfra]: any = useState(null)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);


  const handleCameraClick = (camera) => {
    setSelectedCamera(camera)
    setShowPasswordModal(true)
    setError("")
    setPassword("")
  }

  const handleShowDetails = (infraSno) => {
    const details = getDashboardInfraList?.infraDetails?.filter((detail) => detail.infraSno === infraSno)
    setSelectedInfra(details)
  }

  const handleCardClick = (infraSno) => {
    setSelectedCardId(infraSno)
    handleShowDetails(infraSno)
  }

  const renderInfraIcon = (icon) => {
    const IconComponent = iconMap[icon] || QBoxIcon
    return <IconComponent className="w-full h-full" />
  }

  const getCardColor = (index) => {
    const colors = [
      {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100",
        border: "border-blue-200",
        icon: "text-blue-500 bg-blue-100",
        badge: "bg-blue-500",
      },
      {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100",
        border: "border-purple-200",
        icon: "text-purple-500 bg-purple-100",
        badge: "bg-purple-500",
      },
      {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        border: "border-emerald-200",
        icon: "text-emerald-500 bg-emerald-100",
        badge: "bg-emerald-500",
      },
      {
        bg: "bg-gradient-to-br from-amber-50 to-amber-100",
        border: "border-amber-200",
        icon: "text-amber-500 bg-amber-100",
        badge: "bg-amber-500",
      },
      {
        bg: "bg-gradient-to-br from-rose-50 to-rose-100",
        border: "border-rose-200",
        icon: "text-rose-500 bg-rose-100",
        badge: "bg-rose-500",
      },
    ]
    return colors[index % colors.length]
  }

  const { infraCounts, infraDetails } = getDashboardInfraList || { infraCounts: [], infraDetails: [] }

  if (!infraCounts?.length && !infraDetails?.length) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="text-center px-6 py-8">
          <AlertCircle className="mx-auto mb-6 text-gray-400" size={64} />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Infrastructure Found</h3>
          <p className="text-lg text-gray-600">There are currently no Infra Details Found to display.</p>
        </div>
      </div>
    )
  }

  // const [showUserGrid, setShowUserGrid] = useState(false)
  const [showUserGrid, setShowUserGrid] = useState(false) // State for toggling user grid

  const toggleUserGrid = () => {
    setShowUserGrid(!showUserGrid)
  }


  const handlePasswordSubmit = () => {
    const storedPassword = selectedCamera?.properties.find((p) => p.propertyName === "password")?.value;

    if (password === storedPassword) {
      const url = selectedCamera?.properties.find((p) => p.propertyName === "URL")?.value;
      setShowPasswordModal(false);
      setShowStream(true);

      // Build URL with query parameters
      const params = new URLSearchParams({
        url: url || '',
        from: isFromSupervisor ? 'supervisor' : 'location'
      });

      // Navigate based on source
      const basePath = isFromSupervisor
        ? '/qbox-location-dashboard/cctv-viewer'
        : '/qbox-location-dashboard/cctv-viewer';

      navigate(`${basePath}?${params.toString()}`);
      setIsPasswordValid(true);
    } else {
      setError("Invalid password");
      setIsPasswordValid(false);
    }
  };


  return (
    <div className="animate-fadeIn">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 low-bg-color rounded-full">
            <Building className="w-6 h-6 text-color" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Asset Details</h1>
        </div>
      </div>

      {/* Infrastructure Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {getDashboardInfraList?.infraCounts?.map((infra, index) => {
          const colorScheme = getCardColor(index)
          return (
            <div
              key={infra.infraSno}
              onClick={() => handleCardClick(infra.infraSno)}
              className={`relative overflow-hidden rounded-xl border ${colorScheme.border} ${colorScheme.bg} transition-all duration-300 hover:shadow-lg cursor-pointer ${selectedCardId === infra.infraSno ? "ring-2 ring-offset-2 ring-color" : ""
                }`}
            >
              <div className="absolute top-4 right-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${colorScheme.badge} text-white font-bold text-lg shadow-sm`}
                >
                  {infra.count}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-4 rounded-full ${colorScheme.icon}`}>
                    <div className="w-8 h-8">
                      {renderInfraIcon(
                        getDashboardInfraList?.infraDetails?.find((d) => d.infraSno === infra.infraSno)?.infraIcon ||
                        "",
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{infra.infraName}</h3>
                    <p className="text-sm text-gray-500 mt-1">Total Devices</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-2">
                  <button
                    className="flex items-center justify-between w-full text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(infra.infraSno)
                    }}
                  >
                    <span className="text-sm font-medium">View Details</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Details Section */}
      {selectedCardId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300 animate-fadeIn">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-full">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Device Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getDashboardInfraList?.infraDetails
              ?.filter((detail: any) => detail.infraSno === selectedCardId)
              .map((device, index) => {
                const colorScheme = getCardColor(index)
                return (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className={`${colorScheme.bg} p-4 border-b ${colorScheme.border}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-white shadow-sm`}>
                          <div className="w-6 h-6 text-gray-700">{renderInfraIcon(device.infraIcon)}</div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {device.infraName} {index + 1}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      {/* Show nextServiceDate if available */}
                      {device.nextServiceDate && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3">
                          <div className="text-blue-600">
                            <CalendarDays className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-blue-700 font-medium">Next Service Date</span>
                            <span className="text-sm font-semibold text-blue-900">
                              {new Date(device.nextServiceDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {device.properties.map((prop, propIndex) => (
                          <div
                            key={propIndex}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                          >
                            <span className="text-sm font-medium text-gray-700">{prop.propertyName}</span>
                            {prop.propertyName === "URL" ? (
                              <button
                                onClick={() => handleCameraClick(device)}
                                className="px-3 py-1.5 bg-color text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Stream</span>
                              </button>
                            ) : prop.propertyName === "password" ? (
                              <span className="text-sm text-gray-800">••••••••</span>
                            ) : (
                              <span className="text-sm text-gray-800 font-medium">{prop.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-color px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Authentication Required</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Please enter the password to access the camera stream for{" "}
                <span className="font-medium text-gray-800">{selectedCamera?.infraName}</span>.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter device password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 border ${!isPasswordValid ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={password.length === 0}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center space-x-2 ${password.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-color hover:bg-blue-700"
                  } transition-colors`}
              >
                <Unlock className="w-4 h-4" />
                <span>Connect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EntityInfraDtl