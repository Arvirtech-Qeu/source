import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../tech/core/common/collapse-header";
import ApiService from "../../../tech/core/common/services/ApiServices";
import DeleteEntityInfraProperty from "./delete-entity-infra-property";
import EntityInfraPropertyModal from "./entity-infra-property-modal";

const EntityInfraProperties = () => {
  const [data, setData] = useState([]);
  const [entityInfraProperty, setEntityInfraProperty] = useState(null);

  useEffect(() => {
    searchEntityInfraProperty();
  }, []);

  const handleOpenModal = (record: any) => {
    setEntityInfraProperty(record)
  };
  const dataEntryModel = () => {
    setEntityInfraProperty(null)
  };

  const searchEntityInfraProperty = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_entity_infra_property', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching EntityInfraProperties', error);
    }
  }

  const columns = [
  {
      title: " Entity Infra Sno",
      dataIndex: "entityInfraSno",
      sorter: (a: any, b: any) => a.entityInfraSno.length - b.entityInfraSno.length,
    },{
      title: " Infra Property Sno",
      dataIndex: "infraPropertySno",
      sorter: (a: any, b: any) => a.infraPropertySno.length - b.infraPropertySno.length,
    },{
      title: "Value",
      dataIndex: "value",
      sorter: (a: any, b: any) => a.value.length - b.value.length,
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
              data-bs-target="#add_entityInfraProperty"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_entityInfraProperty"
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
                  <h4 className="page-title">EntityInfraProperties</h4>
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
                          placeholder="Search EntityInfraProperties"
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
                              data-bs-target="#add_entityInfraProperty"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add EntityInfraProperty
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
      <EntityInfraPropertyModal modalData={entityInfraProperty} event={searchEntityInfraProperty} />
      <DeleteEntityInfraProperty modalData={entityInfraProperty} event={searchEntityInfraProperty} />

    </div >

  );
};
export default EntityInfraProperties;
