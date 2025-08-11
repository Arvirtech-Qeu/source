import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../tech/core/common/dataTable/index";
import CollapseHeader from "../../../../tech/core/common/collapse-header";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import DeleteSalesOrder from "./delete-sales-order";
import SalesOrderModal from "./sales-order-modal";
import { Badge, Card, Col, List, Row, Steps, Tag } from "antd";
import Timeline from "./Timeline";

const SalesOrders = () => {
  const [data, setData]: any = useState([]);
  const [salesOrder, setSalesOrder] = useState(null);
  const [activeItem, setItem]: any = useState();
  const [orderDetails, setOrderDetails]: any = useState();
  let navigate = useNavigate();

  const toggleCollapse = (itemIndex: number) => {
    const updatedOrderDetails = orderDetails.map((item: any, index: any) => ({
      ...item,
      collapse: index === itemIndex ? !item.collapse : false,
    }));
    setOrderDetails(updatedOrderDetails);
  };

  useEffect(() => {
    const itemIndex = orderDetails?.findIndex(
      (item: any) => item?.collapse == true
    );
    console.log(itemIndex);
    if (orderDetails?.length && itemIndex != -1 && !orderDetails[itemIndex]?.items?.length) {
      searchSkuInventory(itemIndex);
    }
  }, [orderDetails]);

  useEffect(() => {
    searchSalesOrderDtl();
  }, [activeItem]);

  const searchSkuInventory = async (itemIndex: any) => {
    try {
      const params = {
        salesOrderDtlSno: orderDetails[itemIndex]?.salesOrderDtlSno,
      };
      const result = await ApiService(
        "8912",
        "post",
        "search_sku_inventory",
        params,
        null
      );
      console.log(result?.data?.length);
      if (result?.data?.length) {
        orderDetails[itemIndex].items = result?.data ?? [];
      }
      const updatedOrderDetails = orderDetails.map((item: any, index: any) => ({
        ...item
      }));
      setOrderDetails(updatedOrderDetails);
    } catch (error) {
      console.error("Error fetching SalesOrders", error);
    }
  };

  const searchSalesOrderDtl = async () => {
    try {
      const params = {
        salesOrderSno: activeItem?.salesOrderSno,
      };
      const result = await ApiService(
        "8912",
        "post",
        "search_sales_order_dtl",
        params,
        null
      );
      if (result?.data?.length) {
        result.data = result.data.map((item: any) => ({
          ...item,
          collapse: false,
        }));
        setOrderDetails(result.data);
      }
    } catch (error) {
      console.error("Error fetching SalesOrders", error);
    }
  };

  useEffect(() => {
    searchSalesOrder();
  }, []);

  const handleOpenModal = (record: any) => {
    setSalesOrder(record);
  };
  const dataEntryModel = () => {
    setSalesOrder(null);
  };

  const searchSalesOrder = async () => {
    try {
      const params = {};
      const result = await ApiService(
        "8912",
        "post",
        "search_sales_order",
        params,
        null
      );
      if (result?.data?.length) {
        setData(result?.data);
        setItem(result?.data[0]);
      }
    } catch (error) {
      console.error("Error fetching SalesOrders", error);
    }
  };


  const acceptSKU = async (skuInventorySno:any) => {

    const itemIndex = orderDetails?.findIndex(
      (item: any) => item?.collapse == true
    );
    try {
      const params = {skuInventorySno:skuInventorySno};
      const result = await ApiService(
        "8912",
        "post",
        "accept_sku",
        params,
        null
      );
      console.log(result?.data?.length);
      if (result?.data?.length) {
        orderDetails[itemIndex].items = result?.data ?? [];
      }
      const updatedOrderDetails = orderDetails.map((item: any, index: any) => ({
        ...item
      }));
      setOrderDetails(updatedOrderDetails);
    } catch (error) {
      console.error("Error fetching SalesOrders", error);
    }
  };


  const rejectSKU= async (skuInventorySno:any) => {
    const itemIndex = orderDetails?.findIndex(
      (item: any) => item?.collapse == true
    );
    try {
      const params = {skuInventorySno:skuInventorySno};
      const result = await ApiService(
        "8912",
        "post",
        "reject_sku",
        params,
        null
      );
      console.log(result?.data?.length);
      if (result?.data?.length) {
        orderDetails[itemIndex].items = result?.data ?? [];
      }
      const updatedOrderDetails = orderDetails.map((item: any, index: any) => ({
        ...item
      }));
      setOrderDetails(updatedOrderDetails);
    } catch (error) {
      console.error("Error fetching SalesOrders", error);
    }
  };


  function handleClick(skuInventorySno:any) {
    navigate('/supply-chain/tracking',{state:skuInventorySno})
  }

  const skuColumn = [
    {
      title: "QBOX SKU Code",
      dataIndex: "uniqueCode",
    },
    {
      title: "SKU Status",
      dataIndex: "wfStageCd",
      render: (_: any, { skuInventorySno, wfStageCd }: any) => (
        wfStageCd === 6 ? 'Awaiting Delivery' : (
          <div>
            {wfStageCd === 7 ? (
              <>
                <Tag color="green" style={{ cursor: 'pointer' }} onClick={() => acceptSKU(skuInventorySno)}>
                  Accept & Move to Hot Box
                </Tag>
                <Tag color="red" style={{ cursor: 'pointer' }} onClick={() => rejectSKU(skuInventorySno)}>
                  Reject Sku
                </Tag>
              </>
            ) : (
              wfStageCd === 8 ? 'Rejected' : (
                wfStageCd === 9 ? 'Accepted' : (
                  wfStageCd === 10 ? 'In Hot Box' : (
                    wfStageCd === 11 ? 'In Queue Box' : (
                      wfStageCd === 12 ? 'Returned to Hot box' : (
                        wfStageCd === 13 ? 'Outward Delivery Picked up' : ''
                      )
                    )
                  )
                )
              )
            )}
          </div>
        )
      )
    },
    {
      title: "Track SKU",
      dataIndex: "skuInventorySno",
      render: (_: any, { skuInventorySno }: any) => (
        <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => handleClick(skuInventorySno)}>
          Track SKU
        </Tag>
      ),
    },
  ];
  const description = 'This is a description.';
  const items = [
    {
      title: 'Finished',
      description,
    },
    {
      title: 'In Progress',
      description,
    },
    {
      title: 'Waiting',
      description,
    },
  ];
  const columns = [
    {
      title: " Qbox Entity Sno",
      dataIndex: "qboxEntitySno",
      sorter: (a: any, b: any) =>
        a.qboxEntitySno.length - b.qboxEntitySno.length,
    },
    {
      title: " Restaurant Sno",
      dataIndex: "restaurantSno",
      sorter: (a: any, b: any) =>
        a.restaurantSno.length - b.restaurantSno.length,
    },
    {
      title: " Delivery Partner Sno",
      dataIndex: "deliveryPartnerSno",
      sorter: (a: any, b: any) =>
        a.deliveryPartnerSno.length - b.deliveryPartnerSno.length,
    },
    {
      title: " Order Status Cd",
      dataIndex: "orderStatusCd",
      sorter: (a: any, b: any) =>
        a.orderStatusCd.length - b.orderStatusCd.length,
    },
    {
      title: " Ordered Time",
      dataIndex: "orderedTime",
      sorter: (a: any, b: any) => a.orderedTime.length - b.orderedTime.length,
    },
    {
      title: " Ordered By",
      dataIndex: "orderedBy",
      sorter: (a: any, b: any) => a.orderedBy.length - b.orderedBy.length,
    },
    {
      title: " Partner Sales Order Id",
      dataIndex: "partnerSalesOrderId",
      sorter: (a: any, b: any) =>
        a.partnerSalesOrderId.length - b.partnerSalesOrderId.length,
    },
    {
      title: " Meal Time Cd",
      dataIndex: "mealTimeCd",
      sorter: (a: any, b: any) => a.mealTimeCd.length - b.mealTimeCd.length,
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
                  <h4 className="page-title">DELHI BELLY Customer's Food Orders to QBOX Remote Location </h4>
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
                          placeholder="Search  Orders"
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
                              New Order
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <Row style={{ height: "90vh" }} className="d-flex">
                  <Col span={8} className=" p-2 overflow-auto" style={{ maxHeight: '90vh' }}>
                    <h4 className="page-title"> Customer's Food Orders</h4>
                    <List
                      dataSource={data}
                      renderItem={(item: any) => (
                        <List.Item
                          className="px-2 border-0"
                          onClick={() => {
                            setItem(item);
                          }}
                        >
                          <Card
                            className={`w-100 shadow pointer ${item.partnerSalesOrderId ==
                              activeItem?.partnerSalesOrderId
                              ? "activeItem"
                              : ""
                              }`}
                          >
                            <p className="m-0"><b>Order Id : {item.partnerSalesOrderId}</b></p>
                            <p className="m-0">Deliver To : Delhi Belly Customer</p>
                            <p className="m-0">Food From : {item.qboxEntity1name}</p>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col span={16} className="p-2 overflow-auto " style={{ borderLeft: '1px solid #e9eaeb', maxHeight: '90vh' }} >
                    <h4 className="page-title">Order Details</h4>
                    <div className="my-3">
                      {orderDetails?.length ? (
                        <div>
                          {orderDetails?.map((item: any, itemIndex: any) => (
                            <Card className="m-2 shadow">
                              <p className="d-flex justify-content-between">
                              <img alt={item.title} src="/south-indian-classics.png" height={'100px'} width={'100px'} style={{ borderRadius: '10px', padding: '10px' }} />
                                <span>{item.partnerFoodCode} - {item.foodSku1name}</span>
                                
                                Order Quantity<Badge style={{fontSize:20,width:40,height:22}} count={item.orderQuantity} />
                              </p>
                              {/*<p className="d-flex justify-content-between">
                              <span>QBOX SKU (FOOD) ID: {item.foodSkuSno}</span>
                                 <span>
                                  <div
                                    role="button"
                                    tabIndex={itemIndex} // Make the div focusable
                                    onClick={() => toggleCollapse(itemIndex)}
                                  >
                                    {item.collapse ? "▼" : "View SKU(s) ►"}{" "}
                                  </div>
                                </span> 
                              </p>*/}
                              
                              {/* {item.collapse && (
                                <Table
                                  columns={skuColumn}
                                  dataSource={item.items}
                                />
                              )} */}
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <List
                            dataSource={[]}
                            renderItem={() => <div></div>}
                          />
                        </div>
                      )}
                    </div>
                    
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SalesOrderModal width={800}
        modalData={salesOrder}
        event={searchSalesOrder}
      />
      <DeleteSalesOrder
        modalData={salesOrder}
        event={searchSalesOrder}
      />
    </div>
  );
};
export default SalesOrders;