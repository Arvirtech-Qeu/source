import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteFoodSku from "./delete-food-sku";
import FoodSkuModal from "./food-sku-modal";

const FoodSkus = () => {
  const [data, setData] = useState([]);
  const [foodSku, setFoodSku] = useState(null);

  useEffect(() => {
    searchFoodSku();
  }, []);

  const handleOpenModal = (record: any) => {
    setFoodSku(record)
  };
  const dataEntryModel = () => {
    setFoodSku(null)
  };

  const searchFoodSku = async () => {
    try {
      const data = {};
      const result = await ApiService('8911', 'post', 'search_food_sku', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching FoodSkus', error);
    }
  }

  const columns = [
  {
      title: " Restaurant Brand Cd",
      dataIndex: "restaurantBrandCd",
      sorter: (a: any, b: any) => a.restaurantBrandCd.length - b.restaurantBrandCd.length,
    },{
      title: " Food Name",
      dataIndex: "foodName",
      sorter: (a: any, b: any) => a.foodName.length - b.foodName.length,
    },{
      title: " Sku Code",
      dataIndex: "skuCode",
      sorter: (a: any, b: any) => a.skuCode.length - b.skuCode.length,
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
              data-bs-target="#add_foodSku"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_foodSku"
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
                  <h4 className="page-title">FoodSkus</h4>
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
                          placeholder="Search FoodSkus"
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
                              data-bs-target="#add_foodSku"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add FoodSku
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
      <FoodSkuModal modalData={foodSku} event={searchFoodSku} />
      <DeleteFoodSku modalData={foodSku} event={searchFoodSku} />

    </div >

  );
};
export default FoodSkus;
