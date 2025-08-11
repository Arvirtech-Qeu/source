import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteSalesOrder from "./delete-sales-order";
import SalesOrderModal from "./sales-order-modal";

const SalesOrders = () => {
  const [data, setData] = useState([]);
  const [salesOrder, setSalesOrder] = useState(null);

  useEffect(() => {
    searchSalesOrder();
  }, []);

  const handleOpenModal = (record: any) => {
    setSalesOrder(record)
  };
  const dataEntryModel = () => {
    setSalesOrder(null)
  };

  const searchSalesOrder = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_sales_order', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching SalesOrders', error);
    }
  }

  const columns = [
  {
      title: " Partner Sales Order Id",
      dataIndex: "partnerSalesOrderId",
      sorter: (a: any, b: any) => a.partnerSalesOrderId.length - b.partnerSalesOrderId.length,
    },{
      title: " Qbox Entity Sno",
      dataIndex: "qboxEntitySno",
      sorter: (a: any, b: any) => a.qboxEntitySno.length - b.qboxEntitySno.length,
    },{
      title: " Delivery Partner Sno",
      dataIndex: "deliveryPartnerSno",
      sorter: (a: any, b: any) => a.deliveryPartnerSno.length - b.deliveryPartnerSno.length,
    },{
      title: " Sales Order Status Cd",
      dataIndex: "salesOrderStatusCd",
      sorter: (a: any, b: any) => a.salesOrderStatusCd.length - b.salesOrderStatusCd.length,
    },{
      title: " Ordered Time",
      dataIndex: "orderedTime",
      sorter: (a: any, b: any) => a.orderedTime.length - b.orderedTime.length,
    },{
      title: " Ordered By",
      dataIndex: "orderedBy",
      sorter: (a: any, b: any) => a.orderedBy.length - b.orderedBy.length,
    },{
      title: " Partner Customer Ref",
      dataIndex: "partnerCustomerRef",
      sorter: (a: any, b: any) => a.partnerCustomerRef.length - b.partnerCustomerRef.length,
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
              data-bs-target="#add_salesOrder"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_salesOrder"
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
                  <h4 className="page-title">SalesOrders</h4>
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
                          placeholder="Search SalesOrders"
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
                              data-bs-target="#add_salesOrder"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add Customer Order
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
      <SalesOrderModal modalData={salesOrder} event={searchSalesOrder} />
      <DeleteSalesOrder modalData={salesOrder} event={searchSalesOrder} />

    </div >

  );
};
export default SalesOrders;
