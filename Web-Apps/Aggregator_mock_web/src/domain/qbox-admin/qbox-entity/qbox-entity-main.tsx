import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../tech/core/common/collapse-header";
import ApiService from "../../../tech/core/common/services/ApiServices";
import DeleteQboxEntity from "./delete-qbox-entity";
import QboxEntityModal from "./qbox-entity-modal";

const QboxEntities = () => {
  const [data, setData] = useState([]);
  const [qboxEntity, setQboxEntity] = useState(null);

  useEffect(() => {
    searchQboxEntity();
  }, []);

  const handleOpenModal = (record: any) => {
    setQboxEntity(record)
  };
  const dataEntryModel = () => {
    setQboxEntity(null)
  };

  const searchQboxEntity = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_qbox_entity', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching QboxEntities', error);
    }
  }

  const columns = [
  {
      title: " Qbox Entity Name",
      dataIndex: "qboxEntityName",
      sorter: (a: any, b: any) => a.qboxEntityName.length - b.qboxEntityName.length,
    },{
      title: " Address Sno",
      dataIndex: "addressSno",
      sorter: (a: any, b: any) => a.addressSno.length - b.addressSno.length,
    },{
      title: " Area Sno",
      dataIndex: "areaSno",
      sorter: (a: any, b: any) => a.areaSno.length - b.areaSno.length,
    },{
      title: " Qbox Entity Status Cd",
      dataIndex: "qboxEntityStatusCd",
      sorter: (a: any, b: any) => a.qboxEntityStatusCd.length - b.qboxEntityStatusCd.length,
    },{
      title: " Created On",
      dataIndex: "createdOn",
      sorter: (a: any, b: any) => a.createdOn.length - b.createdOn.length,
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
              data-bs-target="#add_qboxEntity"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_qboxEntity"
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
                  <h4 className="page-title">QboxEntities</h4>
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
                          placeholder="Search QboxEntities"
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
                              data-bs-target="#add_qboxEntity"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add QboxEntity
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
      <QboxEntityModal modalData={qboxEntity} event={searchQboxEntity} />
      <DeleteQboxEntity modalData={qboxEntity} event={searchQboxEntity} />

    </div >

  );
};
export default QboxEntities;
