import { Card, Col, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { TbTruckDelivery } from "react-icons/tb";
import { FaRupeeSign } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdDeliveryDining } from "react-icons/md";
import './form.css';
import MakeOrder from './MakeOrder';


const QBoxOrder: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

   

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    return (
        <div className='page-wrapper my-2'>
            <div className='content'>
                <Card>
                    <Row gutter={16} className='py-2'>
                        <Col span={21}>
                            <div className="d-flex">
                                <TbTruckDelivery style={{ fontSize: '30px', color: 'red' }} />
                                <h3 className='px-2 fw-bold'>ORDER HISTORY</h3>
                            </div>
                        </Col>
                        <Col span={3} className='text-end'>
                            <button type="button" className="btn btn-danger fw-bold" onClick={showModal}>New Order</button>
                        </Col>
                    </Row>
                    <hr />
                    {[1, 2, 3, 4, 5, 6].map(item => (
                        <Card className='my-1'>
                            <Row gutter={16}>
                                <Col span={20}>
                                    <div className="d-flex">
                                        <img src="/assets/briyani.jpg" className='rounded-circle' alt="" width={100} height={100} />
                                        <div className='px-3'>
                                            <h4 className='fw-bold'>Briyani</h4>
                                            <h5 className='text-secondary'>A2B</h5>
                                            <div className='d-flex'>
                                                {[1, 2, 3, 4, 5].map(item => (
                                                    <img src="/assets/start.png" alt="" width={20} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div className='px-3 text-end'>
                                        <h3 className='fw-bold'> <FaRupeeSign color='green' fontSize={18} className='mx-2' />
                                            1200</h3>
                                        <h5 className='text-secondary mx-2'>Qt: 120</h5>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Card>
            </div>
            <Modal title={<><MdDeliveryDining fontSize={30} color='red' /> Make your order now !
            </>} closeIcon={<GoDotFill fontSize={25} color='red' />} open={isModalOpen} onOk={handleOk} footer={null} onCancel={handleCancel} width={800}>
                <MakeOrder cancel={handleOk}/>
            </Modal>
        </div>
    );
};

export default QBoxOrder;