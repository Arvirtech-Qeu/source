import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteArea from "./delete-area";
import AreaModal from "./area-modal";

const Areas = () => {
  const [data, setData] = useState([]);
  const [area, setArea] = useState(null);

  useEffect(() => {
    searchArea();
  }, []);

  const handleOpenModal = (record: any) => {
    setArea(record)
  };
  const dataEntryModel = () => {
    setArea(null)
  };

  const searchArea = async () => {
    try {
      const data = {};
      const result = await ApiService('8911', 'post', 'search_area', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching Areas', error);
    }
  }

  const columns = [
    {
      title: " Country",
      dataIndex: "countrySno",
      render: (text: any, record: any) => (record?.countrySno === 1 ? "India" : "USA"),
      sorter: (a: any, b: any) => a.countrySno.length - b.countrySno.length,
    }, {
      title: " State ",
      dataIndex: "stateSno",
      render: (text: any, record: any) => (record?.stateSno === 1 ? "Tamilnadu" : "Kerala"),
      sorter: (a: any, b: any) => a.stateSno.length - b.stateSno.length,
    }, {
      title: " City ",
      dataIndex: "citySno",
      render: (text: any, record: any) => (record?.citySno === 1 ? "Chennai" : "Others"),
      sorter: (a: any, b: any) => a.citySno.length - b.citySno.length,
    },{
      title: "Name",
      dataIndex: "name",
      sorter: (a: any, b: any) => a.name.length - b.name.length,
    },{
      title: "Pincode",
      dataIndex: "pincode",
      sorter: (a: any, b: any) => a.pincode.length - b.pincode.length,
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
              data-bs-target="#add_area"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_area"
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
                  <h4 className="page-title">Areas</h4>
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
                          placeholder="Search Areas"
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
                              data-bs-target="#add_area"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add Area
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
      <AreaModal modalData={area} event={searchArea} />
      <DeleteArea modalData={area} event={searchArea} />

    </div >

  );
};
export default Areas;
