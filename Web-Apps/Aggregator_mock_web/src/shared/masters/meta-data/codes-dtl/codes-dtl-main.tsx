import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteCodesDtl from "./delete-codes-dtl";
import CodesDtlModal from "./codes-dtl-modal";

const CodesDtls = () => {
  const [data, setData] = useState([]);
  const [codesDtl, setCodesDtl] = useState(null);

  useEffect(() => {
    searchCodesDtl();
  }, []);

  const handleOpenModal = (record: any) => {
    setCodesDtl(record)
  };
  const dataEntryModel = () => {
    setCodesDtl(null)
  };

  const searchCodesDtl = async () => {
    try {
      const data = {};
      const result = await ApiService('8911', 'post', 'search_codes_dtl', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching CodesDtls', error);
    }
  }

  const columns = [
  {
      title: " Codes Hdr Sno",
      dataIndex: "codesHdrSno",
      sorter: (a: any, b: any) => a.codesHdrSno.length - b.codesHdrSno.length,
    },{
      title: " Cd Value",
      dataIndex: "cdValue",
      sorter: (a: any, b: any) => a.cdValue.length - b.cdValue.length,
    },{
      title: "Seqno",
      dataIndex: "seqno",
      sorter: (a: any, b: any) => a.seqno.length - b.seqno.length,
    },{
      title: " Filter 1",
      dataIndex: "filter1",
      sorter: (a: any, b: any) => a.filter1.length - b.filter1.length,
    },{
      title: " Filter 2",
      dataIndex: "filter2",
      sorter: (a: any, b: any) => a.filter2.length - b.filter2.length,
    },{
      title: " Active Flag",
      dataIndex: "activeFlag",
      sorter: (a: any, b: any) => a.activeFlag.length - b.activeFlag.length,
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
              data-bs-target="#add_codesDtl"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_codesDtl"
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
                  <h4 className="page-title">CodesDtls</h4>
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
                          placeholder="Search CodesDtls"
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
                              data-bs-target="#add_codesDtl"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add CodesDtl
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
      <CodesDtlModal modalData={codesDtl} event={searchCodesDtl} />
      <DeleteCodesDtl modalData={codesDtl} event={searchCodesDtl} />

    </div >

  );
};
export default CodesDtls;
