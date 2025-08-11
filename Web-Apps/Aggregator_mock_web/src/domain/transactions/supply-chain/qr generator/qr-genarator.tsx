import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Timeline from "../purchase-order/Timeline";
import ApiService from "../../../../tech/core/common/services/ApiServices";
import AutocompleteSelect from "../../../../tech/core/common/components/AutoCompleteSelect";
import { QRCode } from "antd";



export default function QRCreater() {
    const [data, setData] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [purchaseOrderDtl, setPurchaseOrderDtl] = useState(null);
    const location = useLocation()
    const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);
    const [inventorySno, setInventroySno] = useState(location?.state)
    const handleChange = (value: string) => {
        setSelectedItem(value);
    };
    useEffect(() => {
        searchSkuTraceWf();
        getFoodCode();
    }, [inventorySno]);

    const searchSkuTraceWf = async () => {
        try {
            var body: any = {};
            body.skuInventorySno = inventorySno ?? null;
            const result = await ApiService('8912', 'post', 'search_sku_trace_wf', body, null);
            console.log(result)
            if (result?.data) {
                setData(result?.data);
                // setData(result?.data)
            }
        }
        catch (error) {
            console.error('Error fetching SkuTraceWfs', error);
        }
    }

    const getFoodCode = async () => {
        try {
            var body: any = {};
            // body.skuInventorySno = inventorySno ?? null;
            const result = await ApiService('8912', 'post', 'search_sku_inventory', body, null);
            console.log(result)
            if (result?.data) {
                setInventory(result?.data);
                // setData(result?.data)
            }
        }
        catch (error) {
            console.error('Error fetching SkuTraceWfs', error);
        }
    }
    const handleOpenModal = (record: any) => {
        setPurchaseOrderDtl(record);
    };
    function handleInventory() {
        setInventroySno(selectedItem);
    }
    const columns = [
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

                    </div>
                </div>
            ),
        },
    ]


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
                                        {/* <CollapseHeader /> */}
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
                                        <div className="col-md-4 col-sm-8">
                                            <div className="form-wrap icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-search" />
                                                </span>
                                                <AutocompleteSelect
                                                    placeholder="Select Your Food"
                                                    options={inventory}
                                                    value={selectedItem}
                                                    valueSno="skuInventorySno"
                                                    name="uniqueCode"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-sm-8">

                                        </div>
                                        {/* <div className="col-md-3 col-sm-4">
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
                                        </div> */}
                                        <div className="col-md-6 col-sm-4">
                                            <div className="export-list text-sm-end">
                                                <ul>
                                                    <li>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-primary"
                                                            onClick={handleInventory}
                                                        >
                                                            <i className="ti ti-square-rounded-plus" />
                                                            Search
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="table-responsive custom-table">
                                    <Timeline searchSno={inventorySno} />
                                    <Table columns={columns} dataSource={data} />
                                </div> */}
                                <div>
      <QRCode value="<https://www.example.com>" />
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

        </div >

    );
};

