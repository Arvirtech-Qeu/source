import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../tech/core/common/collapse-header";
import ApiService from "../../../tech/core/common/services/ApiServices";
import DeleteQboxEntityDeliveryPartner from "./delete-qbox-entity-delivery-partner";
import QboxEntityDeliveryPartnerModal from "./qbox-entity-delivery-partner-modal";

const QboxEntityDeliveryPartners = () => {
  const [data, setData] = useState([]);
  const [qboxEntityDeliveryPartner, setQboxEntityDeliveryPartner] = useState(null);

  useEffect(() => {
    searchQboxEntityDeliveryPartner();
  }, []);

  const handleOpenModal = (record: any) => {
    setQboxEntityDeliveryPartner(record)
  };
  const dataEntryModel = () => {
    setQboxEntityDeliveryPartner(null)
  };

  const searchQboxEntityDeliveryPartner = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_qbox_entity_delivery_partner', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching QboxEntityDeliveryPartners', error);
    }
  }

  const columns = [
  {
      title: " Delivery Type Cd",
      dataIndex: "deliveryTypeCd",
      sorter: (a: any, b: any) => a.deliveryTypeCd.length - b.deliveryTypeCd.length,
    },{
      title: " Qbox Entity Sno",
      dataIndex: "qboxEntitySno",
      sorter: (a: any, b: any) => a.qboxEntitySno.length - b.qboxEntitySno.length,
    },{
      title: " Delivery Partner Sno",
      dataIndex: "deliveryPartnerSno",
      sorter: (a: any, b: any) => a.deliveryPartnerSno.length - b.deliveryPartnerSno.length,
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
              data-bs-target="#add_qboxEntityDeliveryPartner"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_qboxEntityDeliveryPartner"
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
                  <h4 className="page-title">QboxEntityDeliveryPartners</h4>
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
                          placeholder="Search QboxEntityDeliveryPartners"
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
                              data-bs-target="#add_qboxEntityDeliveryPartner"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add QboxEntityDeliveryPartner
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
      <QboxEntityDeliveryPartnerModal modalData={qboxEntityDeliveryPartner} event={searchQboxEntityDeliveryPartner} />
      <DeleteQboxEntityDeliveryPartner modalData={qboxEntityDeliveryPartner} event={searchQboxEntityDeliveryPartner} />

    </div >

  );
};
export default QboxEntityDeliveryPartners;
