
// import Header from '@/components/Header';
// import { FlexibleTable } from '@/components/FlexibleTable';
// import { Sidebar } from '@/components/SideBar';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Dashboard from '@/module/dashboard/dashboard';
// import { useEffect } from 'react';

// export const mockUser = {
//   name: "Nandy",
//   email: "nandy@swomb.app",
//   role: "Administrator",
//   avatar: "https://media.licdn.com/dms/image/v2/D5603AQHLHi0wSacxkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1694168848444?e=2147483647&v=beta&t=SDcL7Whvwlg5x5AU3NqchBJdN30cGjmmiWQxUMnjTA0"
// };

// const Layout = ({ children }: any) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="flex-1 p-6 overflow-auto">
//           <Outlet />

//           {/* Main content goes here */}
//           {/* {children} */}

//         </main>
//       </div>
//     </div>
//   );
// };

// // const Layout = ({children}: any) => {

// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const DashboardComponent = location.pathname === '/dashboard'; 
// //   const roleMapping = location.pathname === '/mapping/role-permission-mapping'; 
// //   const moduleMapping = location.pathname === '/mapping/module-menu-mapping'; 
// //   const menuMapping = location.pathname === '/mapping/module-mapping'; 

// //    // Redirect to dashboard if logged in and on the root path
// //    useEffect(() => {
// //     if (location.pathname === '/') {
// //       navigate('/dashboard');
// //     }
// //   }, [location, navigate]);

// //   return (
// //     <div className="flex h-screen bg-gray-50">
// //       <Sidebar />
// //       <div className="flex-1 flex flex-col">
// //         <Header />
// //         <main className={`flex-1 ${!( DashboardComponent || roleMapping || moduleMapping || menuMapping) ? 'p-6' : ''} overflow-auto`}>
// //         <Outlet />
// //         {/* <Dashboard /> */}
// //           {/* Main content goes here */}
// //           {/* {children} */}

// //         </main>
// //       </div>
// //     </div>
// //   );
// // };


// export default Layout;




import Header from '@/components/Header';
import { FlexibleTable } from '@/components/FlexibleTable';
import { Sidebar } from '@/components/SideBar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from '@/module/dashboard/dashboard';
import { useEffect } from 'react';

// export const mockUser = {
//   name: "Nandy",
//   email: "nandy@swomb.app",
//   role: "Administrator",
//   avatar: "https://media.licdn.com/dms/image/v2/D5603AQHLHi0wSacxkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1694168848444?e=2147483647&v=beta&t=SDcL7Whvwlg5x5AU3NqchBJdN30cGjmmiWQxUMnjTA0"
// };

export const mockUser = JSON.parse(localStorage.getItem('user') || '{}');


// const Layout = ({children}: any) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="flex-1 p-6 overflow-auto">
//         <Outlet />

//           {/* Main content goes here */}
//           {/* {children} */}

//         </main>
//       </div>
//     </div>
//   );
// };

const Layout = ({ children }: any) => {

  const location = useLocation();
  const navigate = useNavigate();

  const DashboardComponent = location.pathname === '/dashboard';
  const roleMapping = location.pathname === '/mapping/role-permission-mapping';
  const moduleMapping = location.pathname === '/mapping/module-menu-mapping';
  const menuMapping = location.pathname === '/mapping/module-mapping';

  // Redirect to dashboard if logged in and on the root path
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className={`flex-1 ${!(DashboardComponent || roleMapping || moduleMapping || menuMapping) ? 'p-6' : ''} overflow-auto`}>
          <Outlet />
          {/* <Dashboard /> */}
          {/* Main content goes here */}
          {/* {children} */}

        </main>
      </div>
    </div>
  );
};


export default Layout;