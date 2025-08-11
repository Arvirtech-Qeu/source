// import * as Yup from 'yup';
// import { useEffect, useState } from 'react';
// import ApiService from '../../../../tech/core/common/services/ApiServices';
// import { Button, Col, Form, Input, Row, Select, Table, TableProps, Tag, message } from 'antd';
// import AutocompleteSelect from '../../../../tech/core/common/components/AutoCompleteSelect';
// import { GoDotFill } from 'react-icons/go';

// const { Option } = Select;

// const SalesOrderModal = (modalData: any) => {
//     const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);
//     const [qboxList, setQBoxList] = useState([]);
//     const [restaurantList, setRestaurantList] = useState([]);
//     const [foodList, setFoodList] = useState([]);
//     const [entityItem, setEntityItem] = useState<string | undefined>(undefined);
//     const [foodItem, setFoodItem] = useState<string | undefined>(undefined);
//     const [orderList, setOrderList]: any = useState([]);
//     const [deliveryAggregateList, setDeliveryAggregateList] = useState([])
//     // console.log(modalData)
//     useEffect(() => {
//         console.log('Component mounted');
//         fetchQbox();
//         fetchRestaurant();
//         fetchFood();
//         fetchDeliveryAggregate();
//     }, []);

//     const fetchQbox = async () => {
//         try {
//             const data = {};
//             const result = await ApiService('8912', 'post', 'search_qbox_entity', data, null);
//             console.log(result)
//             if (result && result?.data) {
//                 setQBoxList(result?.data);
//             }
//         }
//         catch (error) {
//             console.error('Error fetching projects roles', error);
//         }
//     }

//     const fetchDeliveryAggregate = async () => {
//         try {
//             const data = {};
//             const result = await ApiService('8912', 'post', 'search_delivery_partner', data, null);
//             console.log(result)
//             if (result && result?.data) {
//                 setDeliveryAggregateList(result?.data);
//             }
//         }
//         catch (error) {
//             console.error('Error fetching projects roles', error);
//         }
//     }

//     const fetchRestaurant = async () => {
//         try {
//             const data = {};
//             const result = await ApiService('8911', 'post', 'search_restaurant', data, null);
//             console.log(result)
//             if (result && result?.data) {
//                 setRestaurantList(result?.data);
//             }
//         }
//         catch (error) {
//             console.error('Error fetching projects roles', error);
//         }
//     }

//     const fetchFood = async () => {
//         try {
//             const data = {};
//             const result = await ApiService('8911', 'post', 'search_restaurant_food_sku', data, null);
//             console.log(result)
//             if (result && result?.data) {
//                 setFoodList(result?.data);
//             }
//         }
//         catch (error) {
//             console.error('Error fetching projects roles', error);
//         }
//     }
//     useEffect(() => {
//         console.log('Order list updated:', orderList);
//     }, [orderList]);
//     const addData = (data: any) => {
//         setOrderList((prevOrderList: any) => [
//             ...prevOrderList,
//             {
//                 restaurantFoodSkuSno: data?.restaurantFoodSkuSno,
//                 orderQuantity: data?.quantity,
//                 skuPrice: 1200,
//                 partnerFoodCode: data?.partnerFoodCode
//             }
//         ]);

//         form.resetFields(['restaurantFoodSkuSno']);
//         form.resetFields(['quantity']);
//         form.resetFields(['partnerFoodCode']);
//         console.log('Button clicked!' + JSON.stringify(orderList));
//     };
//     function generateRandomOrderId(prefix: any, length: any) {
//         const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
//         const paddedNumber = String(randomNumber).padStart(length, '0');
//         return prefix + paddedNumber;
//     }
//     const onOrderNow = async () => {
//         var body: any = {};
//         body.qboxEntitySno = form.getFieldValue('qboxEntitySno');
//         body.restaurantSno = form.getFieldValue('restaurantSno');
//         body.deliveryPartnerSno = form.getFieldValue('deliveryPartnerSno');;
//         body.orderStatusCd = 1;
//         body.orderedBy = 1;
//         body.partnerSalesOrderId = generateRandomOrderId('DLBL', 3);
//         body.salesOrderDtl = orderList;

//         try {
//             const result = await ApiService('8912', 'post', 'partner_channel_outward_order', body, null);
//             console.log(result)
//             if (result && result?.data) {
//                 setOrderList([]);
//                 form.resetFields();
//                 modalData.event();

//                 // cancel();

//                 // setFoodList(result?.data);
//             } else {
//                 message.warning('Something went wrong');

//             }
//         }
//         catch (error) {
//             message.success('This is a success message');

//             console.error('Error fetching projects roles', error);
//         }
//         console.log(body)

//     }
//     const columns: TableProps<any>['columns'] = [
//         {
//             title: 'Food',
//             dataIndex: 'restaurantFoodSkuSno',
//             key: 'restaurantFoodSkuSno',
//             render: (text: any) => {
//                 const orderItem: any = foodList.find((item: any) => item.restaurantFoodSkuSno === text);
//                 return (
//                     <>
//                         {orderItem ? orderItem.restaurantSkuName : 'Not Found'}
//                     </>
//                 );
//             },
//         },
//         {
//             title: 'Quantity',
//             dataIndex: 'orderQuantity',
//             key: 'orderQuantity',
//             // render: (text: any) => <a>{text}</a>,
//         },
//         {
//             title: 'Price',
//             dataIndex: 'skuPrice',
//             key: 'skuPrice',
//             // render: (text: any) => <a>{text}</a>,
//         },
//         // {
//         //     title: 'Partner Code',
//         //     key: 'partnerFoodCode',
//         //     dataIndex: 'partnerFoodCode',
//         //     render: (_: any, { partnerFoodCode }: any) => (
//         //         <>
//         //             <Tag color={'red'} key={partnerFoodCode}>
//         //                 {partnerFoodCode.toUpperCase()}
//         //             </Tag>
//         //         </>
//         //     ),
//         // },
//         {
//             title: 'Action',
//             key: 'restaurantFoodSkuSno',
//             dataIndex: 'restaurantFoodSkuSno',
//             render: (value: any) => (
//                 <>
//                     <GoDotFill fontSize={30} color="red" onClick={() => onRemove(value)} />

//                 </>
//             ),
//         },
//     ];

//     const onRemove = (value: any) => {
//         // Do something with the value when clicked
//         const updatedOrderList = orderList.filter((item: any) => item.restaurantFoodSkuSno !== value);
//         setOrderList(updatedOrderList);
//         console.log('Clicked with value:', value);
//     };

//     const handleChange = (value: string) => {
//         setSelectedItem(value);
//     };
//     const handleEntityChange = (value: string) => {
//         setEntityItem(value);
//     };
//     const handleFoodChange = (value: string) => {
//         setFoodItem(value);
//     };

//     const [form] = Form.useForm();

//     const onFinish = (values: any) => {
//         addData(values);
//         console.log('Received values:', values);
//     };

//     const onFinishFailed = (errorInfo: any) => {
//         console.log('Failed:', errorInfo);
//     };
//     useEffect(() => {
//         console.log(modalData)

//     }, [modalData]);


//     return (
//         <div className="modal custom-modal fade " id="add_salesOrder" role="dialog">
//             <div className="modal-dialog modal-dialog-centered modal-lg">
//                 <div className="modal-content">
//                     <div className="modal-header">

//                         {modalData?.modalData ? (
//                             <>
//                                 <h5 className="modal-title">Edit Sales Order</h5>
//                             </>
//                         ) : (
//                             <>
//                                 <h5 className="modal-title">New Order</h5>
//                             </>
//                         )}
//                         <div className="d-flex align-items-center mod-toggle">
//                             <button
//                                 className="btn-close"
//                                 data-bs-dismiss="modal"
//                                 aria-label="Close"
//                             >
//                                 <i className="ti ti-x" />
//                             </button>
//                         </div>
//                     </div>
//                     <div className="modal-body">
//                         <Form
//                             form={form}
//                             name="myForm"
//                             onFinish={onFinish}
//                             onFinishFailed={onFinishFailed}
//                             layout="vertical"
//                         >

//                             <Row gutter={16}>
//                                 <Col span={8}>
//                                     <Form.Item
//                                         name="qboxEntitySno"
//                                         label=""
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 message: 'Please select an option!',
//                                             },
//                                         ]}
//                                     >
//                                         <AutocompleteSelect
//                                             placeholder="Select QBox"
//                                             options={qboxList}
//                                             value={selectedItem}
//                                             valueSno="qboxEntitySno"
//                                             name="qboxEntityName"
//                                             onChange={handleChange}
//                                         />
//                                     </Form.Item>

//                                 </Col>
//                                 <Col span={8}>
//                                     <Form.Item
//                                         name="deliveryPartnerSno"
//                                         label=""
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 message: 'Please select an option!',
//                                             },
//                                         ]}
//                                     >
//                                         <AutocompleteSelect
//                                             placeholder="Select Delivery Aggregate"
//                                             options={deliveryAggregateList}
//                                             value={entityItem}
//                                             valueSno="deliveryPartnerSno"
//                                             name="partnerName"
//                                             onChange={handleEntityChange}
//                                         />
//                                     </Form.Item>

//                                 </Col>
//                                 {/* <Col span={8}>

//                                     <Select
//                                         placeholder="Select an option"
//                                         className="my-select"
//                                         size="large"
//                                         dropdownStyle={{ borderRadius: '8px' }}
//                                         defaultValue="option1"
//                                     // rules={[
//                                     //     {
//                                     //         required: true,
//                                     //         message: 'Please select an option!',
//                                     //     },
//                                     // ]}
//                                     >
//                                         <Option value="option1" disabled>Delhi Belly</Option>
//                                         <Option value="option12" disabled> Belly</Option>
//                                     </Select>
//                                 </Col> */}
//                             </Row>
//                             <br />
//                             <Row gutter={16}>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="restaurantFoodSkuSno"
//                                         label=""
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 message: 'Please select an option!',
//                                             },
//                                         ]}
//                                     >
//                                         <AutocompleteSelect
//                                             placeholder="Select Food"
//                                             options={foodList}
//                                             value={foodItem}
//                                             onChange={handleFoodChange}
//                                             valueSno="restaurantFoodSkuSno"
//                                             name="description"

//                                         />
//                                     </Form.Item>

//                                 </Col>
//                                 <Col span={6}>
//                                     <Form.Item
//                                         name="quantity"
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 message: 'Please enter quantity!',
//                                             },
//                                         ]}
//                                     >
//                                         <Input placeholder="Enter Quantity" size="large" type="number" />
//                                     </Form.Item>
//                                 </Col>
//                                 {/* <Col span={6}>
//                                     <Form.Item
//                                         name="partnerFoodCode"
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 message: 'Please enter Partner code!',
//                                             },
//                                         ]}
//                                     >
//                                         <Input placeholder="Enter Partner Code" size="large" />
//                                     </Form.Item>
//                                 </Col> */}
//                             </Row>

//                             <Form.Item>
//                                 <Button type="primary" htmlType="submit" className="float-end " style={{ backgroundColor: '#ffe8e5', color: 'red' }} >
//                                     Add
//                                 </Button>
//                             </Form.Item>
//                         </Form>
//                         <Table columns={columns} dataSource={orderList} pagination={false} />

//                         <div className="">
//                             <Button data-bs-dismiss="modal" onClick={() => onOrderNow()} className="float-end my-2 h6 py-2 " style={{ backgroundColor: 'orange', color: 'white' }} >
//                                 Order Now
//                             </Button>
//                         </div>
//                         <br></br>
//                         <br></br>
//                     </div>
//                 </div >
//             </div >
//         </div >
//     );
// };

// export default SalesOrderModal;






import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';
import { Button, Col, Form, Input, Row, Select, Table, TableProps, Tag, message } from 'antd';
import AutocompleteSelect from '../../../../tech/core/common/components/AutoCompleteSelect';
import { GoDotFill } from 'react-icons/go';

const { Option } = Select;

const SalesOrderModal = (modalData: any) => {
    const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);
    const [qboxList, setQBoxList] = useState([]);
    const [partnerFoodSkuList, setPartnerFoodSkuList] = useState([]);
    const [restaurantList, setRestaurantList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [entityItem, setEntityItem] = useState<string | undefined>(undefined);
    const [foodItem, setFoodItem] = useState<string | undefined>(undefined);
    const [orderList, setOrderList]: any = useState([]);
    const [deliveryAggregateList, setDeliveryAggregateList] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        console.log('Component mounted');
        fetchQbox();
        fetchRestaurant();
        fetchDeliveryAggregate();
    }, []);

    const fetchQbox = async () => {
        try {
            const data = {};
            const result = await ApiService('8912', 'post', 'search_qbox_entity', data, null);
            console.log(result);
            if (result && result?.data) {
                setQBoxList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching QBox entities', error);
        }
    }

    const fetchDeliveryAggregate = async () => {
        try {
            const data = {};
            const result = await ApiService('8912', 'post', 'search_delivery_partner', data, null);
            console.log(result);
            if (result && result?.data) {
                setDeliveryAggregateList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching delivery partners', error);
        }
    }

    const fetchRestaurant = async () => {
        try {
            const data = {};
            const result = await ApiService('8911', 'post', 'search_restaurant', data, null);
            console.log(result);
            if (result && result?.data) {
                setRestaurantList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching restaurants', error);
        }
    }

    const fetchSalesinventory = async () => {
        const qboxEntitySno = form.getFieldValue('qboxEntitySno');
        const deliveryPartnerSno = form.getFieldValue('deliveryPartnerSno');

        if (!qboxEntitySno || !deliveryPartnerSno) {
            console.log('QBox entity or delivery partner not selected');
            return;
        }

        try {
            // Get current date in YYYY-MM-DD format
            const today = new Date();
            const transactionDate = today.toISOString().split('T')[0];

            const data = {
                qboxEntitySno,
                deliveryPartnerSno,
                transactionDate
            };

            console.log('Fetching sales inventory with:', data);

            const result = await ApiService('8911', 'post', 'get_sales_sku_inventory', data, null);
            console.log(result);
            if (result && result?.data) {
                setFoodList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching sales inventory', error);
        }
    }

    useEffect(() => {
        console.log('Order list updated:', orderList);
    }, [orderList]);

    // Handle QBox selection change
    const handleChange = (value: string) => {
        setSelectedItem(value);
        // Check if both QBox and Delivery Aggregate are selected
        if (value && form.getFieldValue('deliveryPartnerSno')) {
            fetchSalesinventory();
        }
    };

    // Handle Delivery Aggregate selection change
    const handleEntityChange = (value: string) => {
        setEntityItem(value);
        // Check if both QBox and Delivery Aggregate are selected
        if (value && form.getFieldValue('qboxEntitySno')) {
            fetchSalesinventory();
        }
    };

    const handleFoodChange = (value: string) => {
        setFoodItem(value);
    };

    const addData = (data: any) => {
        setOrderList((prevOrderList: any) => [
            ...prevOrderList,
            {
                restaurantFoodSkuSno: data?.restaurantFoodSkuSno,
                orderQuantity: data?.quantity,
                skuPrice: 1200,
                partnerFoodCode: data?.partnerFoodCode
            }
        ]);

        form.resetFields(['restaurantFoodSkuSno']);
        form.resetFields(['quantity']);
        form.resetFields(['partnerFoodCode']);
        console.log('Button clicked!' + JSON.stringify(orderList));
    };

    function generateRandomOrderId(prefix: any, length: any) {
        const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
        const paddedNumber = String(randomNumber).padStart(length, '0');
        return prefix + paddedNumber;
    }

    // Add this at the top of your file with other imports
    const usedNumbers = new Set<number>();

    const usedIds = new Set<string>();

    // function generateRandomOrderId(prefix: string, randomLength: number = 3): string {
    //     let orderId: string;

    //     do {
    //         const random = Math.floor(Math.random() * Math.pow(10, randomLength))
    //             .toString()
    //             .padStart(randomLength, '0');
    //         orderId = `${prefix}${random}`;
    //     } while (usedIds.has(orderId));

    //     usedIds.add(orderId);
    //     return orderId;
    // }

    const onOrderNow = async () => {
        var body: any = {};
        body.qboxEntitySno = form.getFieldValue('qboxEntitySno');
        body.restaurantSno = form.getFieldValue('restaurantSno');
        body.deliveryPartnerSno = form.getFieldValue('deliveryPartnerSno');
        body.orderStatusCd = 14;
        body.orderedBy = 1;
        body.partnerSalesOrderId = generateRandomOrderId('DLBL', 3);
        body.salesOrderDtl = orderList;

        try {
            const result = await ApiService('8912', 'post', 'partner_channel_outward_order', body, null);
            console.log(result)
            if (result && result?.data) {
                setOrderList([]);
                form.resetFields();
                modalData.event();
                message.success('Order placed successfully');
            } else {
                message.warning('Something went wrong');
            }
        }
        catch (error) {
            message.error('Error placing order');
            console.error('Error placing order', error);
        }
        console.log(body)
    }

    const columns: TableProps<any>['columns'] = [
        {
            title: 'Food',
            dataIndex: 'restaurantFoodSkuSno',
            key: 'restaurantFoodSkuSno',
            render: (text: any) => {
                const orderItem: any = foodList.find((item: any) => item.restaurantFoodSkuSno === text);
                return (
                    <>
                        {orderItem ? orderItem.restaurantSkuName : 'Not Found'}
                    </>
                );
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'orderQuantity',
            key: 'orderQuantity',
        },
        {
            title: 'Price',
            dataIndex: 'skuPrice',
            key: 'skuPrice',
        },
        {
            title: 'Action',
            key: 'restaurantFoodSkuSno',
            dataIndex: 'restaurantFoodSkuSno',
            render: (value: any) => (
                <>
                    <GoDotFill fontSize={30} color="red" onClick={() => onRemove(value)} />
                </>
            ),
        },
    ];

    const onRemove = (value: any) => {
        const updatedOrderList = orderList.filter((item: any) => item.restaurantFoodSkuSno !== value);
        setOrderList(updatedOrderList);
        console.log('Removed item with value:', value);
    };

    const onFinish = (values: any) => {
        addData(values);
        console.log('Received values:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        console.log(modalData)
    }, [modalData]);

    return (
        <div className="modal custom-modal fade " id="add_salesOrder" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit Sales Order</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">New Order</h5>
                            </>
                        )}
                        <div className="d-flex align-items-center mod-toggle">
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                    </div>
                    <div className="modal-body">
                        <Form
                            form={form}
                            name="myForm"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="qboxEntitySno"
                                        label=""
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select QBox!',
                                            },
                                        ]}
                                    >
                                        <AutocompleteSelect
                                            placeholder="Select QBox"
                                            options={qboxList}
                                            value={selectedItem}
                                            valueSno="qboxEntitySno"
                                            name="qboxEntityName"
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="deliveryPartnerSno"
                                        label=""
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select Delivery Aggregate!',
                                            },
                                        ]}
                                    >
                                        <AutocompleteSelect
                                            placeholder="Select Delivery Aggregate"
                                            options={deliveryAggregateList}
                                            value={entityItem}
                                            valueSno="deliveryPartnerSno"
                                            name="partnerName"
                                            onChange={handleEntityChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <br />
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="restaurantFoodSkuSno"
                                        label=""
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select Food!',
                                            },
                                        ]}
                                    >
                                        <AutocompleteSelect
                                            placeholder="Select Food"
                                            options={foodList}
                                            value={foodItem}
                                            onChange={handleFoodChange}
                                            valueSno="restaurantFoodSkuSno"
                                            name="restaurantSkuName"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="quantity"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter quantity!',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter Quantity" size="large" type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="float-end " style={{ backgroundColor: '#ffe8e5', color: 'red' }} >
                                    Add
                                </Button>
                            </Form.Item>
                        </Form>
                        <Table columns={columns} dataSource={orderList} pagination={false} />

                        <div className="">
                            <Button data-bs-dismiss="modal" onClick={() => onOrderNow()} className="float-end my-2 h6 py-2 " style={{ backgroundColor: 'orange', color: 'white' }} >
                                Order Now
                            </Button>
                        </div>
                        <br></br>
                        <br></br>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default SalesOrderModal;