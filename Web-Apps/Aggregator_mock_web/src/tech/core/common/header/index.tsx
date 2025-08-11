import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
 
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu, setMiniSidebar, setMobileSidebar } from "../../data/redux/commonSlice";
import { all_routes } from "../../../router/all_routes";


const Header = () => {
  const route = all_routes;
  const location = useLocation();
  const dispatch = useDispatch();

  const mobileSidebar = useSelector((state: any) => state.mobileSidebar);
  const miniSidebar = useSelector((state: any) => state.miniSidebar);
  const expandMenu = useSelector((state: any) => state.expandMenu);

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };
  const toggleExpandMenu = () => {
    dispatch(setExpandMenu(!expandMenu));
  };
  
  const [themeSetting, setThemeSetting] = useState(false);
  console.log(themeSetting, "themeSetting");

  const [layoutBs, setLayoutBs] = useState(
    localStorage.getItem("layoutThemeColors")
  );
  const isLockScreen = location.pathname === "/lock-screen";

  if (isLockScreen) {
    return null;
  }
  const LayoutDark = () => {
    localStorage.setItem("layoutThemeColors", "dark");
    setThemeSetting(true);
    setLayoutBs("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };
  const LayoutLight = () => {
    localStorage.setItem("layoutThemeColors", "light");
    // setLayoutTheme("light");
    setLayoutBs("light");

    setThemeSetting(false);

    document.documentElement.setAttribute("data-theme", "light");
  };

  return (
    <>
      {/* Header */}
      <div className="header" onClick={toggleExpandMenu}>
        {/* Logo */}
        <div className="header-left active">
          <Link to={route.qboxDashboard} className="logo logo-normal">
            {themeSetting ? (
              <ImageWithBasePath src="assets/img/white-logo.svg" className="white-logo" alt="Logo" />
            ) : (
              <ImageWithBasePath src="assets/img/Delhi Belly.png" alt="Logo" className="p-3"/>
            )}

          </Link>
          <Link to={route.remoteLocationPerformance} className="logo-small">
            <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
          </Link>
          <Link id="toggle_btn" to="#" onClick={toggleMiniSidebar}>
            <i className="ti ti-arrow-bar-to-left" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <ul className="nav user-menu">
            {/* Search */}
            
            <li className="nav-item nav-search-inputs me-auto">
              <div className="top-nav-search">
                <h3><span style={{color:'orange'}}>Delivery Channel Mock System</span></h3>
                {/* <form className="dropdown">
                  <div className="searchinputs" id="dropdownMenuClickable">
                    <input type="text" placeholder="Search" />
                    <div className="search-addon">
                      <button type="submit">
                        <i className="ti ti-command" />
                      </button>
                    </div>
                  </div>
                </form> */}
              </div>
            </li>
            {/* /Search */}
            {/* Nav List */}
            <li className="nav-item nav-list">
              <ul className="nav">
                <li className="dark-mode-list">
                  <Link
                    to="#"
                    className={`dark-mode-toggle ${themeSetting ? "" : "active"
                      }`}
                    id="dark-mode-toggle"
                  >
                    <i
                      className={`ti ti-sun light-mode ${themeSetting ? "" : "active"
                        }`}
                      onClick={LayoutLight}
                    >
                      {" "}
                    </i>
                    <i
                      className={`ti ti-moon dark-mode ${themeSetting ? "active" : ""
                        }`}
                      onClick={LayoutDark}
                    ></i>
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link to="#" className="btn btn-help">
                    <i className="ti ti-help-hexagon" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="btn btn-chart-pie">
                    <i className="ti ti-chart-pie" />
                  </Link>
                </li>
              </ul>
            </li>
            {/* /Nav List */}
            {/* Email */}
             
            {/* /Email */}
            {/* Notifications */}
            
            {/* /Notifications */}
            {/* Profile Dropdown */}
            <li className="nav-item dropdown has-arrow main-drop">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    <ImageWithBasePath
                      src="assets/img/profiles/avatar-14.jpg"
                      alt="Profile"
                    />
                  </span>
                  <span className="badge badge-success rounded-pill" />
                </span>
              </Link>
              <div className="dropdown-menu menu-drop-user">
                <div className="profilename">
                  <Link className="dropdown-item" to={route.qboxDashboard}>
                    <i className="ti ti-layout-2" /> Dashboard
                  </Link>
                  <Link className="dropdown-item" to={route.profile}>
                    <i className="ti ti-user-pin" /> My Profile
                  </Link>
                  <Link className="dropdown-item" to={route.login}>
                    <i className="ti ti-lock" /> Logout
                  </Link>
                </div>
              </div>
            </li>
            {/* /Profile Dropdown */}
          </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to={route.qboxDashboard}>
              <i className="ti ti-layout-2" /> Dashboard
            </Link>
            <Link className="dropdown-item" to={route.profile}>
              <i className="ti ti-user-pin" /> My Profile
            </Link>
            <Link className="dropdown-item" to={route.login}>
              <i className="ti ti-lock" /> Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
