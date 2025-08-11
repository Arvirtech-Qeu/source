import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteSkuInventory from "./delete-sku-inventory";
import SkuInventoryModal from "./sku-inventory-modal";

const SkuInventories = () => {
  const [data, setData] = useState([]);
  const [skuInventory, setSkuInventory] = useState(null);

  useEffect(() => {
    searchSkuInventory();
  }, []);

  const handleOpenModal = (record: any) => {
    setSkuInventory(record)
  };
  const dataEntryModel = () => {
    setSkuInventory(null)
  };

  const searchSkuInventory = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_sku_inventory', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching SkuInventories', error);
    }
  }

  const columns = [
  {
      title: " Purchase Order Dtl Sno",
      dataIndex: "purchaseOrderDtlSno",
      sorter: (a: any, b: any) => a.purchaseOrderDtlSno.length - b.purchaseOrderDtlSno.length,
    },{
      title: " Unique Code",
      dataIndex: "uniqueCode",
      sorter: (a: any, b: any) => a.uniqueCode.length - b.uniqueCode.length,
    },{
      title: " Sales Order Dtl Sno",
      dataIndex: "salesOrderDtlSno",
      sorter: (a: any, b: any) => a.salesOrderDtlSno.length - b.salesOrderDtlSno.length,
    },{
      title: " Wf Stage Cd",
      dataIndex: "wfStageCd",
      sorter: (a: any, b: any) => a.wfStageCd.length - b.wfStageCd.length,
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
              data-bs-target="#add_skuInventory"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_skuInventory"
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
                  <h4 className="page-title">SkuInventories</h4>
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
                          placeholder="Search SkuInventories"
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
                              data-bs-target="#add_skuInventory"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add SkuInventory
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
      <SkuInventoryModal modalData={skuInventory} event={searchSkuInventory} />
      <DeleteSkuInventory modalData={skuInventory} event={searchSkuInventory} />

    </div >

  );
};
export default SkuInventories;
