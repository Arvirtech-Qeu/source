import React , {useState} from "react";
import Table from "../../tech/core/common/dataTable";
import Select, { StylesConfig } from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../tech/router/all_routes";
import { appMenusData } from "../../tech/core/data/json/appMenu";
import CollapseHeader from "../../tech/core/common/collapse-header";

const route = all_routes;


const AppMenus = () => {
  const [addMenu, setAddMenu] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Menu");
  const data = appMenusData;
  const togglePopup = (isEditing: any) => {
    setAddMenu(!addMenu);
    setModalTitle(isEditing ? "Edit Menu" : "Add New Menu");
  };
  const customStyles: StylesConfig = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff7e00" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff7e00",
      },
    }),
  };

 
  const options2 = [
    { value: "Choose", label: "Choose" },
    { value: "Germany", label: "Germany" },
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
    { value: "India", label: "India" },
    { value: "China", label: "China" },
  ];

  const [passwords, setPasswords] = useState([false, false]);

  const togglePassword = (index: any) => {
    const updatedPasswords = [...passwords];
    updatedPasswords[index] = !updatedPasswords[index];
    setPasswords(updatedPasswords);
  };

  const columns = [
    {
      title: "Menu Label",
      render: (text: any, record: any) => (
        <div className="table-avatar d-flex align-items-center">
          <Link
            to={text.link}
            className="profile-split d-flex flex-column"
          >
          <b>  {record.label} </b>
            <span>{text.link}</span>
          </Link>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Parent Menu",
      dataIndex: "parentMenuLabel",
      key: "parentMenuLabel",
      sorter: true,
    },
    {
      title: "Page Header",
      dataIndex: "subMenuHdr",
      key: "subMenuHdr",
      sorter: true,
    },
    {
      title: "Icon",
      dataIndex: "icon",
      render: (text: string) => (
        <div>
          {text}
           {/* <i class={{text}}></i> */}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Has Sub Menu",
      dataIndex: "subMenu",
      render: (subMenu: boolean) => (
        <div>
          {subMenu === true && (
            <span className="badge badge-pill badge-status bg-success">
              {"YES"}
            </span>
          )}

          {subMenu === false && (
            <span className="badge badge-pill badge-status bg-danger">
              {"NO"}
            </span>
          )}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Show Sub Route",
      dataIndex: "showSubRoute",
      render: (showSubRoute: boolean) => (
        <div>
          {showSubRoute === true && (
            <span className="badge badge-pill badge-status bg-success">
              {"YES"}
            </span>
          )}

          {showSubRoute === false && (
            <span className="badge badge-pill badge-status bg-danger">
              {"NO"}
            </span>
          )}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <div>
          {text === "Active" && (
            <span className="badge badge-pill badge-status bg-success">
              {text}
            </span>
          )}

          {text === "Inactive" && (
            <span className="badge badge-pill badge-status bg-danger">
              {text}
            </span>
          )}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => togglePopup(true)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];
  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
    timePicker: false,
  };
  return (
    <>
     
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h4 className="page-title">
                        Menu<span className="count-title">123</span>
                      </h4>
                    </div>
                    <div className="col-4 text-end">
                      <div className="head-icons">
                        <CollapseHeader />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Page Header */}
                <div className="card main-card">
                  <div className="card-body">
                    {/* Search */}
                    <div className="search-section">
                      <div className="row">
                        <div className="col-md-5 col-sm-4">
                          <div className="form-wrap icon-form">
                            <span className="form-icon">
                              <i className="ti ti-search" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search Menu"
                            />
                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="ti ti-package-export" />
                                    Export
                                  </Link>
                                  <div className="dropdown-menu  dropdown-menu-end">
                                    <ul>
                                      <li>
                                        <Link to="#">
                                          <i className="ti ti-file-type-pdf text-danger" />
                                          Export as PDF
                                        </Link>
                                      </li>
                                      <li>
                                        <Link to="#">
                                          <i className="ti ti-file-type-xls text-green" />
                                          Export as Excel{" "}
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="btn btn-primary add-popup"
                                  onClick={() => togglePopup(false)}
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  Add Menu
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Search */}
                    
                    {/* Manage Menus List */}
                    <div className="table-responsive custom-table">
                      <Table dataSource={data} columns={columns} />
                    </div>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="datatable-length" />
                      </div>
                      <div className="col-md-6">
                        <div className="datatable-paginate" />
                      </div>
                    </div>
                    {/* /Manage Menus List */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Menu */}
        <div className={`toggle-popup ${addMenu ? "sidebar-popup" : ""}`}>
          <div className="sidebar-layout">
            <div className="sidebar-header">
              <h4>{modalTitle}</h4>

              <Link
                to="#"
                className="sidebar-close toggle-btn"
                onClick={togglePopup}
              >
                <i className="ti ti-x" />
              </Link>
            </div>
            <div className="toggle-body">
              <div className="pro-create">
                <form>
                  <div className="accordion-lists" id="list-accord">
                    {/* Basic Info */}
                    <div className="manage-menu-modal">
                      <div className="manage-menu-modals">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                {" "}
                                Menu Label  <span className="text-danger">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Parent Menu <span className="text-danger">*</span>
                              </label>
                              <Select styles={customStyles} className="select" options={options2} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                {" "}
                                Router Link  <span className="text-danger">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                {" "}
                                Menu Icon  <span className="text-danger">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Page Header <span className="text-danger">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="radio-wrap">
                              <label className="col-form-label">Has Sub Menu?</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="subMenuYes"
                                    name="subMenu"
                                    defaultChecked={true}
                                  />
                                  <label htmlFor="subMenuYes">YES</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="subMenuNo"
                                    name="subMenu"
                                  />
                                  <label htmlFor="subMenuNo">NO</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="radio-wrap">
                              <label className="col-form-label">Show Sub Menu Route?</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="showSubRouteYes"
                                    name="showSubRoute"
                                    defaultChecked={true}
                                  />
                                  <label htmlFor="showSubRouteYes">YES</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="showSubRouteNo"
                                    name="showSubRoute"
                                  />
                                  <label htmlFor="showSubRouteNo">NO</label>
                                </div>
                              </div>
                              <div>&nbsp;</div>
                            </div>
                          </div><div className="col-md-6">
                            <div className="radio-wrap">
                              <label className="col-form-label">Sub Menu Open?</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="subMenuOpenYes"
                                    name="subMenuOpen"
                                    defaultChecked={true}
                                  />
                                  <label htmlFor="subMenuOpenYes">YES</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="subMenuOpenNo"
                                    name="subMenuOpen"
                                  />
                                  <label htmlFor="subMenuOpenNo">NO</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="radio-wrap">
                              <label className="col-form-label">Status</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="active1"
                                    name="status"
                                    defaultChecked={true}
                                  />
                                  <label htmlFor="active1">Active</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="inactive1"
                                    name="status"
                                  />
                                  <label htmlFor="inactive1">Inactive</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Basic Info */}
                  </div>
                  <div className="submit-button text-end">
                    <Link to="#" className="btn btn-light sidebar-close">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Menu */}
        <div
          className="modal custom-modal fade"
          id="delete_contact"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 m-0 justify-content-end">
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="success-message text-center">
                  <div className="success-popup-icon">
                    <i className="ti ti-trash-x" />
                  </div>
                  <h3>Remove Menu?</h3>
                  <p className="del-info">
                    Are you sure you want to remove it.
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link to={route.manageUsers} className="btn btn-danger">
                      Yes, Delete it
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     
    </>
  );
};

export default AppMenus;
