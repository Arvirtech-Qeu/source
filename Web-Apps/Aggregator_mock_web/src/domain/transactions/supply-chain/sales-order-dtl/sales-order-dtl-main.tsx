import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteSalesOrderDtl from "./delete-sales-order-dtl";
import SalesOrderDtlModal from "./sales-order-dtl-modal";

const SalesOrderDtls = () => {
  const [data, setData] = useState([]);
  const [salesOrderDtl, setSalesOrderDtl] = useState(null);

  useEffect(() => {
    searchSalesOrderDtl();
  }, []);

  const handleOpenModal = (record: any) => {
    setSalesOrderDtl(record)
  };
  const dataEntryModel = () => {
    setSalesOrderDtl(null)
  };

  const searchSalesOrderDtl = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_sales_order_dtl', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching SalesOrderDtls', error);
    }
  }

  const columns = [
  {
      title: " Sales Order Sno",
      dataIndex: "salesOrderSno",
      sorter: (a: any, b: any) => a.salesOrderSno.length - b.salesOrderSno.length,
    },{
      title: " Partner Food Code",
      dataIndex: "partnerFoodCode",
      sorter: (a: any, b: any) => a.partnerFoodCode.length - b.partnerFoodCode.length,
    },{
      title: " Food Sku Sno",
      dataIndex: "foodSkuSno",
      sorter: (a: any, b: any) => a.foodSkuSno.length - b.foodSkuSno.length,
    },{
      title: " Order Quantity",
      dataIndex: "orderQuantity",
      sorter: (a: any, b: any) => a.orderQuantity.length - b.orderQuantity.length,
    },{
      title: " Sku Price",
      dataIndex: "skuPrice",
      sorter: (a: any, b: any) => a.skuPrice.length - b.skuPrice.length,
    },{
      title: " Delivered Quantity",
      dataIndex: "deliveredQuantity",
      sorter: (a: any, b: any) => a.deliveredQuantity.length - b.deliveredQuantity.length,
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
              data-bs-target="#add_salesOrderDtl"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_salesOrderDtl"
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
                  <h4 className="page-title">SalesOrderDtls</h4>
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
                          placeholder="Search SalesOrderDtls"
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
                              data-bs-target="#add_salesOrderDtl"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add SalesOrderDtl
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
      <SalesOrderDtlModal modalData={salesOrderDtl} event={searchSalesOrderDtl} />
      <DeleteSalesOrderDtl modalData={salesOrderDtl} event={searchSalesOrderDtl} />

    </div >

  );
};
export default SalesOrderDtls;
