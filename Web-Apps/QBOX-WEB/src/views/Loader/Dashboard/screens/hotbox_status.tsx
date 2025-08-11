import { getAllArea } from "@state/areaSlice";
import { getHotboxSummary } from "@state/loaderDashboardSlice";
import { getAllQboxEntities } from "@state/qboxEntitySlice";
import { AppDispatch, RootState } from "@state/store";
import { getFromLocalStorage } from "@utils/storage";
// import { StatusTable } from "@view/Loader/Common widgets/status_table"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HotBoxStatus() {

  const dispatch = useDispatch<AppDispatch>();
  const { getAllHotBoxList } = useSelector((state: RootState) => state.loaderDashboard);
  // const { areaList } = useSelector((state: RootState) => state.area);
  const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
  const [authUserSno, setAuthUserSno]: any = useState(null);
  const [roleName, setRoleName]: any = useState(null);
  const [areaSno, setAreaSno]: any = useState(null);
  const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = getFromLocalStorage('user');

        if (!storedData) {
          throw new Error('No user data found');
        }

        const { loginDetails } = storedData;

        if (!loginDetails) {
          throw new Error('Login details not found');
        }

        // Set both values at once to ensure synchronization
        setRoleName(loginDetails.roleName || null);
        setAreaSno(loginDetails.areaSno || null);
        setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);

        console.log('User data loaded:', {
          authUserId: loginDetails.authUserId,
          roleName: loginDetails.roleName,
          areaSno: loginDetails.areaSno,
          deliveryPartnerSno: loginDetails.deliveryPartnerSno
        });

      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err.message);
      }
    };

    loadUserData();
  }, []);

  // Then update the useEffect
  useEffect(() => {
    const handleQboxEntitiesFetch = () => {
      if (!roleName) {
        console.log('Waiting for role to be loaded...');
        return;
      }

      switch (roleName) {
        case 'Super Admin':
          dispatch(getAllQboxEntities({}));
          break;

        case 'Admin':
          if (!areaSno) {
            console.log('Waiting for area data...');
            return;
          }
          dispatch(getAllQboxEntities({ areaSno }));
          break;

        default:
          console.log('Role not authorized for QBox entities:', roleName);
          break;
      }
    };

    handleQboxEntitiesFetch();
  }, [dispatch, roleName, areaSno]);

  // useEffect(() => {
  //   dispatch(getHotboxSummary({}))
  //   // dispatch(getAllArea({}))
  // }, [dispatch]);

  return (
    // <main className="container mx-auto p-4 max-w-4xl">
    // <StatusTable
    //   title="Hotboxes"
    //   subtitle="Active Hotboxes based on location"
    //   items={getAllHotBoxList}
    //   locations={qboxEntityList}
    //   showSearch={false}
    //   showFilter={true}
    // />
    // </main>
    <></>
  )
}
