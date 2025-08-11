import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteInfraProperty from "./delete-infra-property";
import InfraPropertyModal from "./infra-property-modal";

const InfraProperties = () => {
  const [data, setData] = useState([]);
  const [infraProperty, setInfraProperty] = useState(null);

  useEffect(() => {
    searchInfraProperty();
  }, []);

  const handleOpenModal = (record: any) => {
    setInfraProperty(record)
  };
  const dataEntryModel = () => {
    setInfraProperty(null)
  };

  const searchInfraProperty = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_infra_property', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching InfraProperties', error);
    }
  }

  const columns = [
  {
      title: " Infra Sno",
      dataIndex: "infraSno",
      sorter: (a: any, b: any) => a.infraSno.length - b.infraSno.length,
    },{
      title: " Property Name",
      dataIndex: "propertyName",
      sorter: (a: any, b: any) => a.propertyName.length - b.propertyName.length,
    },{
      title: " Data Type Cd",
      dataIndex: "dataTypeCd",
      sorter: (a: any, b: any) => a.dataTypeCd.length - b.dataTypeCd.length,
    }, 
    {
      title: "Action",
      render: (record: any) => (
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
              data-bs-toggle="modal"
              data-bs-target="#add_infraProperty"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_infraProperty"
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-trash text-danger" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">InfraProperties</h4>
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
                          placeholder="Search InfraProperties"
                        />
                      </div>
                    </div>
                    <div className="col-md-7 col-sm-8">
                      <div className="export-list text-sm-end">
                        <ul>
                          <li>
                            <Link
                              to="#"
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#add_infraProperty"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add InfraProperty
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive custom-table">
                  <Table columns={columns} dataSource={data} />
                </div>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="datatable-length" />
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InfraPropertyModal modalData={infraProperty} event={searchInfraProperty} />
      <DeleteInfraProperty modalData={infraProperty} event={searchInfraProperty} />

    </div >

  );
};
export default InfraProperties;
