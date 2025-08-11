import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteSkuTraceWf from "./delete-sku-trace-wf";
import SkuTraceWfModal from "./sku-trace-wf-modal";

const SkuTraceWfs = () => {
  const [data, setData] = useState([]);
  const [skuTraceWf, setSkuTraceWf] = useState(null);

  useEffect(() => {
    searchSkuTraceWf();
  }, []);

  const handleOpenModal = (record: any) => {
    setSkuTraceWf(record)
  };
  const dataEntryModel = () => {
    setSkuTraceWf(null)
  };

  const searchSkuTraceWf = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_sku_trace_wf', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching SkuTraceWfs', error);
    }
  }

  const columns = [
  {
      title: " App User ",
      dataIndex: "appUser1",
      sorter: (a: any, b: any) => a.appUser1.length - b.appUser1.length,
    },{
      title: " Codes Dtl description",
      dataIndex: "codesDtl1description",
      sorter: (a: any, b: any) => a.codesDtl1description.length - b.codesDtl1description.length,
    },{
      title: " Sku Inventory description",
      dataIndex: "skuInventory1description",
      sorter: (a: any, b: any) => a.skuInventory1description.length - b.skuInventory1description.length,
    },{
      title: " Wf Stage Cd",
      dataIndex: "wfStageCd",
      sorter: (a: any, b: any) => a.wfStageCd.length - b.wfStageCd.length,
    },{
      title: " Action Time",
      dataIndex: "actionTime",
      sorter: (a: any, b: any) => a.actionTime.length - b.actionTime.length,
    },{
      title: " Action By",
      dataIndex: "actionBy",
      sorter: (a: any, b: any) => a.actionBy.length - b.actionBy.length,
    },{
      title: "Reference",
      dataIndex: "reference",
      sorter: (a: any, b: any) => a.reference.length - b.reference.length,
    },{
      title: "Description",
      dataIndex: "description",
      sorter: (a: any, b: any) => a.description.length - b.description.length,
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
              data-bs-target="#add_skuTraceWf"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_skuTraceWf"
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
                  <h4 className="page-title">SkuTraceWfs</h4>
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
                          placeholder="Search SkuTraceWfs"
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
                              data-bs-target="#add_skuTraceWf"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add SkuTraceWf
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
      <SkuTraceWfModal modalData={skuTraceWf} event={searchSkuTraceWf} />
      <DeleteSkuTraceWf modalData={skuTraceWf} event={searchSkuTraceWf} />

    </div >

  );
};
export default SkuTraceWfs;
