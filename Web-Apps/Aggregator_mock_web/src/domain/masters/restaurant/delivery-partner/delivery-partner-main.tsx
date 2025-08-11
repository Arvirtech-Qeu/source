import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteDeliveryPartner from "./delete-delivery-partner";
import DeliveryPartnerModal from "./delivery-partner-modal";

const DeliveryPartners = () => {
  const [data, setData] = useState([]);
  const [deliveryPartner, setDeliveryPartner] = useState(null);

  useEffect(() => {
    searchDeliveryPartner();
  }, []);

  const handleOpenModal = (record: any) => {
    setDeliveryPartner(record)
  };
  const dataEntryModel = () => {
    setDeliveryPartner(null)
  };

  const searchDeliveryPartner = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_delivery_partner', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching DeliveryPartners', error);
    }
  }

  const columns = [
  {
      title: " Partner Code",
      dataIndex: "partnerCode",
      sorter: (a: any, b: any) => a.partnerCode.length - b.partnerCode.length,
    },{
      title: " Partner Name",
      dataIndex: "partnerName",
      sorter: (a: any, b: any) => a.partnerName.length - b.partnerName.length,
    },{
      title: " Partner Status Cd",
      dataIndex: "partnerStatusCd",
      sorter: (a: any, b: any) => a.partnerStatusCd.length - b.partnerStatusCd.length,
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
              data-bs-target="#add_deliveryPartner"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_deliveryPartner"
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
                  <h4 className="page-title">DeliveryPartners</h4>
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
                          placeholder="Search DeliveryPartners"
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
                              data-bs-target="#add_deliveryPartner"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add DeliveryPartner
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
      <DeliveryPartnerModal modalData={deliveryPartner} event={searchDeliveryPartner} />
      <DeleteDeliveryPartner modalData={deliveryPartner} event={searchDeliveryPartner} />

    </div >

  );
};
export default DeliveryPartners;
