import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import ImageWithBasePath from "../../../../tech/core/common/imageWithBasePath";
import DeleteRestaurantFoodSku from "./delete-restaurant-food-sku";
import RestaurantFoodSkuModal from "./restaurant-food-sku-modal";

const RestaurantFoodSkus = () => {
  const [data, setData] = useState([]);
  const [restaurantFoodSku, setRestaurantFoodSku] = useState(null);

  useEffect(() => {
    searchRestaurantFoodSku();
  }, []);

  const handleOpenModal = (record: any) => {
    setRestaurantFoodSku(record)
  };
  const dataEntryModel = () => {
    setRestaurantFoodSku(null)
  };

  const searchRestaurantFoodSku = async () => {
    try {
      const data = {};
      const result = await ApiService('8911', 'post', 'search_restaurant_food_sku', data, null);
      console.log(result)
      if (result?.data) {
        setData(result?.data)
      }
    }
    catch (error) {
      console.error('Error fetching RestaurantFoodSkus', error);
    }
  }

  const columns = [
  {
      title: " Restaurant Sno",
      dataIndex: "restaurantSno",
      sorter: (a: any, b: any) => a.restaurantSno.length - b.restaurantSno.length,
    },{
      title: " Food Sku Sno",
      dataIndex: "foodSkuSno",
      sorter: (a: any, b: any) => a.foodSkuSno.length - b.foodSkuSno.length,
    },{
      title: "Status",
      dataIndex: "status",
      sorter: (a: any, b: any) => a.status.length - b.status.length,
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
              data-bs-target="#add_restaurantFoodSku"
              // onClick={handleOpenModal}
              onClick={() => handleOpenModal(record)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_restaurantFoodSku"
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
                  <h4 className="page-title">RestaurantFoodSkus</h4>
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
                          placeholder="Search RestaurantFoodSkus"
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
                              data-bs-target="#add_restaurantFoodSku"
                              onClick={dataEntryModel}
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add RestaurantFoodSku
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
      <RestaurantFoodSkuModal modalData={restaurantFoodSku} event={searchRestaurantFoodSku} />
      <DeleteRestaurantFoodSku modalData={restaurantFoodSku} event={searchRestaurantFoodSku} />

    </div >

  );
};
export default RestaurantFoodSkus;
