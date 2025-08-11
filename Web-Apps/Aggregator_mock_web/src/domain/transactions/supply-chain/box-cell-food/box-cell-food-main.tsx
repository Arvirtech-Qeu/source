import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteBoxCellFood from "./delete-box-cell-food";
import BoxCellFoodModal from "./box-cell-food-modal";

const BoxCellFoods = () => {
  const [data, setData] = useState([]);
  const [boxCellFood, setBoxCellFood] = useState(null);

  useEffect(() => {
    searchBoxCellFood();
  }, []);

  const handleOpenModal = (record: any) => {
    setBoxCellFood(record)
  };
  const dataEntryModel = () => {
    setBoxCellFood(null)
  };

  const searchBoxCellFood = async () => {
    try {
      const data = {};
      const result = await ApiService('8912', 'post', 'search_box_cell_food', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching BoxCellFoods', error);
    }
  }

  const columns = [
  {
      title: " Box Cell Sno",
      dataIndex: "boxCellSno",
      sorter: (a: any, b: any) => a.boxCellSno.length - b.boxCellSno.length,
    },{
      title: " Sku Inventory Sno",
      dataIndex: "skuInventorySno",
      sorter: (a: any, b: any) => a.skuInventorySno.length - b.skuInventorySno.length,
    },{
      title: " Entry Time",
      dataIndex: "entryTime",
      sorter: (a: any, b: any) => a.entryTime.length - b.entryTime.length,
    },{
      title: " Qbox Entity Sno",
      dataIndex: "qboxEntitySno",
      sorter: (a: any, b: any) => a.qboxEntitySno.length - b.qboxEntitySno.length,
    },{
      title: "Active",
      dataIndex: "active",
      sorter: (a: any, b: any) => a.active.length - b.active.length,
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
              data-bs-target="#add_boxCellFood"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_boxCellFood"
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
                  <h4 className="page-title">BoxCellFoods</h4>
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
                          placeholder="Search BoxCellFoods"
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
                              data-bs-target="#add_boxCellFood"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add BoxCellFood
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
      <BoxCellFoodModal modalData={boxCellFood} event={searchBoxCellFood} />
      <DeleteBoxCellFood modalData={boxCellFood} event={searchBoxCellFood} />

    </div >

  );
};
export default BoxCellFoods;
