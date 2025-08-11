import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, QRCode } from 'antd';
import ApiService from '../../../tech/core/common/services/ApiServices';
import { Link } from 'react-router-dom';

const OrderDetails = () => {
    const [data, setData] = useState([]);
    const [hotbox, setHotbox] = useState([]);
    const [purchaseOrderDtl, setPurchaseOrderDtl] = useState(null);

    useEffect(() => {
        purchaseOrderDtll();
        hotBox();
    }, []);

    const purchaseOrderDtll = async () => {
        try {
            const data = {};
            const result = await ApiService('8912', 'post', 'get_qbox_current_status', data, null);
            console.log(result)
            if (result?.data) {
                setData(result?.data)
            }
        }
        catch (error) {
            console.error('Error fetching PurchaseOrderDtls', error);
        }
    }



    const hotBox = async () => {
        try {
            const data = {};
            const result = await ApiService('8912', 'post', 'get_hotbox_current_status', data, null);
            console.log(result)
            if (result?.data) {
                setHotbox(result?.data)
            }
        }
        catch (error) {
            console.error('Error fetching PurchaseOrderDtls', error);
        }
    }

    // useEffect(() => {
    //     hotBox();
    // }, []);

    // const hotBox = async () => {
    //     try {
    //         const data = {};
    //         const result = await ApiService('8912', 'post', 'get_hot_current_status', data, null);
    //         console.log(result)
    //         if (result?.data) {  
    //             setData(result?.data)
    //         }
    //     }
    //     catch (error) {
    //         console.error('Error fetching PurchaseOrderDtls', error);
    //     }
    // }


    const itemsQbox = [
        {
            title: " boxCellSno",
            dataIndex: "boxCellSno",
        },
        {
            title: " description",
            dataIndex: "description",
        },
        {
            title: " foodUniqueCode",
            dataIndex: "foodUniqueCode",
        },
    ];


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="col-md-12">
                    <div className="card">
                        
                        <div className="card-body">
                            <ul className="nav nav-tabs nav-tabs-solid nav-justified mb-3">
                                <li className="nav-item">
                                    <Link
                                        className="nav-link active"
                                        to="#solid-justified-tab1"
                                        data-bs-toggle="tab"
                                    >
                                        Hot Box
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="#solid-justified-tab2"
                                        data-bs-toggle="tab"
                                    >
                                        Q Box
                                    </Link>
                                </li>

                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane show active" id="solid-justified-tab1">
                               
                                    <div style={{justifyItems:'center',width:'60%',justifyContent:'center'}}>
                                        {hotbox.map((item: any) => (
                                            <Card
                                                key={item.id}
                                                style={{ marginBottom: '10px', }}
                                            >
                                                <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                                                    <h4 style={{ padding: '10px', marginLeft: '50px', borderRight: '1px solid grey' }}>
                                                        
                                                        <QRCode style={{"width": "60px","height": "60px","backgroundColor": "transparent"}} value={item?.uniqueCode} /> {item?.uniqueCode}</h4>

                                                    <img alt={item.title} src="/south-indian-classics.png" height={'150px'} width={'150px'} style={{ borderRadius: '40px', padding: '10px' }} />
                                                    {/* <div style={{ padding: '10px', fontSize: '18px' }}>{item?.uniqueCode}</div> */}
                                                    {/* <div style={{ padding: '10px', fontSize: '18px' }}>Quantity: {item.quantity}</div> */}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    
                                </div>

                                <div className="tab-pane" id="solid-justified-tab2">
                                
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

                                <Row gutter={[16, 16]}>

                                    {data.map((item: any) => (
                                        <Col span={12}>
                                            <Card key={item?.boxCellSno} style={{ boxShadow: '20px', margin: '10px', textAlign: 'center' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {/* <img src={item?.foodUniqueCode ? '/south-indian-classics.png' : '/emptyqbox.png'} alt='Item' height={'50%'} width={'50%'} style={{ borderRadius: '20px' }} /> */}
                                                    {
                                                        item.foodUniqueCode != null ? (
                                                            <div>
                                                                <img src='/south-indian-classics.png' alt='Item' height={'40%'} width={'40%'} style={{ borderRadius: '20px' }} />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <QRCode value={item?.boxCellSno.toString()} style={{ margin: 'auto' }} />
                                                                {item?.boxCellSno}
                                                            </div>
                                                        )
                                                    }

                                                    <h3 style={{ padding: '10px' }}>{item.foodUniqueCode}</h3>

                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Tag color={item % 2 === 0 ? 'red' : 'red'} style={{ width: '51px', textAlign: 'center', fontSize: '15px', }}>{item?.boxCellSno}</Tag>
                                                    <h6 >{item.description}</h6>

                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                            </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>



                <div>
                    <h4 className="page-title">Check Hot Box & Qbox cell Orders</h4>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>

                        </Col>
                        <Col xs={24} md={12}>
                            
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;