import React, { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Clock,
  Plus,
  Store,
  ChevronRight,
  Search,
  Star,
  Building2,
  Pencil,
  CalendarDays,
  Trash,
  Trash2,
  Coffee,
  RotateCcw,
  InfoIcon,
  MonitorCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CardContent,
  CardHeader,
  CardTitle,
  MasterCard,
} from "@components/MasterCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { getAllArea } from "@state/areaSlice";
import { getAllAddress } from "@state/addressSlice";
import { deleteQboxEntity, editQboxEntity, getAllQboxEntities } from "@state/qboxEntitySlice";
import ViewRemoteLocationDetail from "./view-remote-location-details";
import { getFromLocalStorage } from "@utils/storage";
import DateTime from "@components/DateTime";
import { Pagination } from "@components/pagination";
import { getDashboardQboxEntity } from "@state/superAdminDashboardSlice";
import { getAllCity } from "@state/citySlice";
import { getAllState } from "@state/stateSlice";
import { Modal } from "@components/Modal";
import { getAllCountry } from "@state/countrySlice";

interface Restaurant {
  qboxEntitySno: string;
  qboxEntityName: string;
  areaName: string;
  activeFlag: boolean;
  createdOn: string;
  totalOrders?: number;
  cuisine: string;
  entityCode: string;
  rating: number;
  qboxEntityStatusCd: string;
}

interface EntityDashboardProps {
  isHovered: any;
}
const EntityDashboard: React.FC<EntityDashboardProps> = ({ isHovered }) => {

  const { cityList } = useSelector((state: RootState) => state.city);
  const { stateList } = useSelector((state: RootState) => state.state);
  const { areaList } = useSelector((state: RootState) => state.area);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [hanldleopen, sethanldleopen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();
  const { qboxEntityList, qboxEntitySno } = useSelector(
    (state: RootState) => state.qboxEntity
  );
  const [filters, setFilters] = useState({
    citySno: '',
    stateSno: '',
    areaSno: '',
  });
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities]: any = useState([]);
  const [filteredAreas, setFilteredAreas]: any = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Restaurant | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const storedData = getFromLocalStorage('user');
    console.log(storedData)
    dispatch(getAllArea({}));
    dispatch(getAllState({}));
    dispatch(getAllCountry({}));
    dispatch(getAllAddress({}));
  }, []);

  useEffect(() => {
    const storedData = getFromLocalStorage('user');
    dispatch(getAllQboxEntities(qboxEntitySno != '0' ? { qboxEntitySno: qboxEntitySno } : {}));
  }, [dispatch, qboxEntitySno]);


  const formatDateTime = (dateString) => {
    const date = new Date();
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleString();
  };

  const goToAddEntity = () => {
    navigate("/master-settings/entity-dashboard/remote-location-onboarding");
  };

  const handleEditClick = (restaurant) => {
    console.log(restaurant)
    navigate("/master-settings/entity-dashboard/remote-location-onboarding", {
      state: { entityData: restaurant },
    });
  };

  const filteredRestaurants = qboxEntityList.filter((restaurant) => {
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "Active" && restaurant.activeFlag) ||
      (filterStatus === "Inactive" && !restaurant.activeFlag);

    const matchesSearch =
      (restaurant.qboxEntityName &&
        restaurant.qboxEntityName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (restaurant.cuisine &&
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleOpen = (restaurant) => {
    console.log(restaurant)
    setSelectedRestaurant(restaurant);
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setSelectedRestaurant(null);
  };
  const handleConfigureInfra = () => {
    console.log("Configure infrastructure clicked");
  };

  const handleDeleteModalOpen = (qboxEntitySno) => {
    setSelectedEntity(qboxEntitySno);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedEntity(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedEntity) {
      await dispatch(deleteQboxEntity({ qboxEntitySno: selectedEntity }))
      dispatch(getAllQboxEntities({}))
      // await dispatch(deleteArea({ qboxEntitySno: selectedArea.areaSno }));
      // dispatch(getAllArea({}));
      handleDeleteModalClose();
    }
  };

  // const onHandleDelete = async (qboxEntitySno: any) => {
  //   await dispatch(deleteQboxEntity({ qboxEntitySno: qboxEntitySno }))
  //   await dispatch(getAllQboxEntities({}))

  // }

  const handleFilterChange = async (event) => {
    const { name, value } = event.target;
    const fieldName = name
    console.log(fieldName)

    if (fieldName === "stateSno") {
      console.log(value)
      // Fetch states based on selected country
      const response = await dispatch(getAllCity({ stateSno: value }));
      // Assuming the response contains a `payload` with the state list
      const cities = response.payload || [];
      // Update the state with the new list of states
      setFilteredCities(cities);
      setFilteredAreas([]); // Reset areas
      console.log('UPDATED DATEA', cities)
    }
    if (fieldName === "citySno") {
      // Fetch states based on selected country
      const response = await dispatch(getAllArea({ citySno: value }));
      // Assuming the response contains a `payload` with the state list
      const areas = response.payload || [];
      // Update the state with the new list of states
      setFilteredAreas(areas);
    }

    // Update filters state
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'qboxEntitySno' && {
        citySno: '',
        stateSno: '',
        // deliveryPartnerSno: deliveryPartnerSno
      }),
    }));

    const processedFilters: any = {
      ...filters,
      [name]: value === 'all' ? null : value,
    };

    if (name === 'qboxEntitySno') {
      processedFilters.citySno = null;
      processedFilters.stateSno = null;
    }

    Object.keys(processedFilters).forEach((key) => {
      if (processedFilters[key] === 'all' || processedFilters[key] === '') {
        processedFilters[key] = null;
      }
    });
    dispatch(getAllQboxEntities(processedFilters));
    // setIsFilterApplied(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);

  const handleInfra = (qboxEntitySno: any, qboxEntityName) => {
    console.log(qboxEntityName)
    navigate("/master-settings/entity-dashboard/infra-config", {
      state: {
        qboxEntitySno: qboxEntitySno,
        qboxEntityName: qboxEntityName
      },
    });
    navigate(`/master-settings/entity-dashboard/infra-config?qboxEntitySno=${qboxEntitySno}&qboxEntityName=${qboxEntityName}`)
  }
  return (

    <div className="bg-white min-h-screen">
      <div className="custom-gradient-left h-32" />
      <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
        <div className="max-w-8xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-4  rounded-xl">
                <div className="low-bg-color p-3 rounded-xl">
                  <Store className="w-8 h-8 text-color" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">Delivery Location</h1>
                  <p className="text-gray-500 mt-2">Manage all Delivery Location here</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Delivery Locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <button
                  onClick={goToAddEntity}
                  className="bg-color hover:bg-color text-white px-6 py-3 rounded-xl flex items-center gap-2 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Delivery Location
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4 delivery-hub-dashboard">
              <select
                name="stateSno"
                value={filters.stateSno}
                onChange={handleFilterChange}
                className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200"
              >
                <option value="">Select State</option>
                {stateList?.map((state) => (
                  <option key={state.stateSno} value={state.stateSno}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                name="citySno"
                value={filters.citySno}
                onChange={handleFilterChange}
                className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200"
              >
                <option value="">Select City</option>
                {filteredCities?.map((city) => (
                  <option key={city.citySno} value={city.citySno}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                name="areaSno"
                value={filters.areaSno}
                onChange={handleFilterChange}
                className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200"
              >
                <option value="">Select Area</option>
                {filteredAreas?.map((area) => (
                  <option key={area.areaSno} value={area.areaSno}>
                    {area.name}
                  </option>
                ))}
              </select>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setFilters({
                    citySno: '',
                    stateSno: '',
                    areaSno: '',
                  });
                  dispatch(getAllQboxEntities({}));
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-color rounded-lg hover:bg-color 
               focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center gap-2"
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {currentItems?.map((restaurant) => (
              <MasterCard
                key={restaurant.qboxEntitySno}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-300"
              >
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">{restaurant.qboxEntityName}</h2>
                        <div className=" ">
                          <div className="flex justify-between gap-2">
                            <span className="text-sm text-gray-900">Entity Code: {restaurant.entityCode}</span>
                            {restaurant.activeFlag ? (
                              <span className="inline-flex justify-end items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium low-bg-color text-red-700">
                                <span className="w-2 h-2 rounded-full bg-color mr-2"></span>
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(restaurant)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <Pencil size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteModalOpen(restaurant?.qboxEntitySno)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={16} className="text-color" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 bg-gray-50 p-2 rounded-xl">
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-color" />
                        <span>{restaurant.areaName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span>{restaurant.qboxEntityStatusCdName}</span>
                      </div>
                      {restaurant.createdOn && new Date(restaurant.createdOn).getTime() > 0 ? (
                        <div className="flex items-center gap-3 text-emerald-700">
                          <DateTime date={restaurant.createdOn} color="emerald" showDateIcon={true} showTimeIcon={false} />
                        </div>
                      ) : (
                        <div className="flex">
                          <DateTime color="emerald" showDateIcon={true} showTimeIcon={false} date={undefined} />
                          <p>-- -- --</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-300 flex items-center justify-between ">
                      <button
                        onClick={() => handleInfra(restaurant?.qboxEntitySno, restaurant?.qboxEntityName)}
                      >
                        <MonitorCog className="text-color" />
                      </button>
                      <button
                        onClick={() => handleOpen(restaurant)}
                        className="hover:bg-gray-200 p-1 text-color hover:text-red-400 flex font-bold rounded-md transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </CardContent>
              </MasterCard>
            ))}
          </div>
          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            title="Delete"
            type="info"
            size="xl"
            footer={
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md"
                  onClick={handleDeleteModalClose} >
                  No
                </button>
                <button
                  className="px-4 py-2 bg-color text-white rounded-md"
                  onClick={handleDelete} >
                  Yes
                </button>
              </div>
            } >
            <p>Are you sure you want to delete this Delivery Location ?</p>
          </Modal>

          {filteredRestaurants?.length > itemsPerPage && (
            <div className="flex justify-end mr-2 mt-6">
              <Pagination
                totalItems={filteredRestaurants?.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
          {currentItems.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-color" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Locations Found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </div>

      {isPopupOpen && selectedRestaurant && (
        <ViewRemoteLocationDetail
          qboxEntitySno={selectedRestaurant?.qboxEntitySno}
          onClose={handleClose}
          onConfigureInfra={handleConfigureInfra}
        />
      )}
    </div>
  );
};

export default EntityDashboard;