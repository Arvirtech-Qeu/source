import { Button, Col, Form, Input, Row, Select, Space, Table, TableProps, Tag } from "antd";
import { useEffect, useState } from "react";
import AutocompleteSelect from "../../../tech/core/common/components/AutoCompleteSelect";
import ApiService from "../../../tech/core/common/services/ApiServices";
import { GoDotFill } from "react-icons/go";


const { Option } = Select;

export default function MakeOrder({ cancel }: any) {
    const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);
    const [qboxList, setQBoxList] = useState([]);
    const [restaurantList, setRestaurantList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [entityItem, setEntityItem] = useState<string | undefined>(undefined);
    const [foodItem, setFoodItem] = useState<string | undefined>(undefined);
    const [orderList, setOrderList]: any = useState([]);

    useEffect(() => {
        console.log('Component mounted');
        fetchQbox();
        fetchRestaurant();
        fetchFood();
    }, []);

    const fetchQbox = async () => {
        try {
            const data = {};
            const result = await ApiService('8912', 'post', 'search_qbox_entity', data, null);
            console.log(result)
            if (result && result?.data) {
                setQBoxList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching projects roles', error);
        }
    }

    const fetchRestaurant = async () => {
        try {
            const data = {};
            const result = await ApiService('8911', 'post', 'search_restaurant', data, null);
            console.log(result)
            if (result && result?.data) {
                setRestaurantList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching projects roles', error);
        }
    }

    const fetchFood = async () => {
        try {
            const data = {};
            const result = await ApiService('8911', 'post', 'search_restaurant_food_sku', data, null);
            console.log(result)
            if (result && result?.data) {
                setFoodList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching projects roles', error);
        }
    }
    useEffect(() => {
        console.log('Order list updated:', orderList);
    }, [orderList]);
    const addData = (data: any) => {
        setOrderList((prevOrderList: any) => [
            ...prevOrderList,
            {
                foodSkuSno: data?.foodSkuSno,
                orderQuantity: data?.quantity,
                skuPrice: 1200,
                partnerFoodCode: data?.partnerFoodCode
            }
        ]);

        form.resetFields(['foodSkuSno']);
        form.resetFields(['quantity']);
        form.resetFields(['partnerFoodCode']);
        console.log('Button clicked!' + JSON.stringify(orderList));
    };
    function generateRandomOrderId(prefix: any, length: any) {
        const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
        const paddedNumber = String(randomNumber).padStart(length, '0');
        return prefix + paddedNumber;
    }
    const onOrderNow = async () => {
        var body: any = {};
        body.qboxEntitySno = form.getFieldValue('qboxEntitySno');
        body.restaurantSno = form.getFieldValue('restaurantSno');
        body.deliveryPartnerSno = 2;
        body.orderStatusCd = 1;
        body.orderedBy = 1;
        body.partnerPurchaseOrderId = generateRandomOrderId('DLBL', 3);
        body.purchaseOrderDtl = orderList;

        try {
            const result = await ApiService('8912', 'post', 'partner_channel_inward_order', body, null);
            console.log(result)
            if (result && result?.data) {
                setOrderList([]);
                form.resetFields();
                cancel();

                // setFoodList(result?.data);
            }
        }
        catch (error) {
            console.error('Error fetching projects roles', error);
        }
        console.log(body)

    }
    const columns: TableProps<any>['columns'] = [
        {
            title: 'Food',
            dataIndex: 'foodSkuSno',
            key: 'foodSkuSno',
            render: (text: any) => {
                const orderItem: any = foodList.find((item: any) => item.foodSkuSno === text);
                return (
                    <>
                        {orderItem ? orderItem.foodName : 'Not Found'}
                    </>
                );
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'orderQuantity',
            key: 'orderQuantity',
            // render: (text: any) => <a>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'skuPrice',
            key: 'skuPrice',
            // render: (text: any) => <a>{text}</a>,
        },
        {
            title: 'Partner Code',
            key: 'partnerFoodCode',
            dataIndex: 'partnerFoodCode',
            render: (_, { partnerFoodCode }) => (
                <>
                    <Tag color={'red'} key={partnerFoodCode}>
                        {partnerFoodCode.toUpperCase()}
                    </Tag>
                </>
            ),
        },
        {
            title: 'Action',
            key: 'foodSkuSno',
            dataIndex: 'foodSkuSno',
            render: (value: any) => (
                <>
                    <GoDotFill fontSize={30} color="red" onClick={() => onRemove(value)} />

                </>
            ),
        },
    ];

    const onRemove = (value: any) => {
        // Do something with the value when clicked
        const updatedOrderList = orderList.filter((item: any) => item.foodSkuSno !== value);
        setOrderList(updatedOrderList);
        console.log('Clicked with value:', value);
    };

    const handleChange = (value: string) => {
        setSelectedItem(value);
    };
    const handleEntityChange = (value: string) => {
        setEntityItem(value);
    };
    const handleFoodChange = (value: string) => {
        setFoodItem(value);
    };

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        addData(values);
        console.log('Received values:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
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
                                    message: 'Please select an option!',
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
                            name="restaurantSno"
                            label=""
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an option!',
                                },
                            ]}
                        >
                            <AutocompleteSelect
                                placeholder="Select Restaurant"
                                options={restaurantList}
                                value={entityItem}
                                valueSno="restaurantSno"
                                name="restaurantName"
                                onChange={handleEntityChange}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={8}>

                        <Select
                            placeholder="Select an option"
                            className="my-select"
                            size="large"
                            dropdownStyle={{ borderRadius: '8px' }}
                            defaultValue="option1"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: 'Please select an option!',
                        //     },
                        // ]}
                        >
                            <Option value="option1" disabled>Delhi Belly</Option>
                        </Select>
                    </Col>
                </Row>
                <br />
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="foodSkuSno"
                            label=""
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an option!',
                                },
                            ]}
                        >
                            <AutocompleteSelect
                                placeholder="Select Food"
                                options={foodList}
                                value={foodItem}
                                onChange={handleFoodChange}
                                valueSno="foodSkuSno"
                                name="description"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Please select an option!',
                            //     },
                            // ]}
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
                    <Col span={6}>
                        <Form.Item
                            name="partnerFoodCode"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter Partner code!',
                                },
                            ]}
                        >
                            <Input placeholder="Enter Partner Code" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="float-end " style={{ backgroundColor: 'red', color: 'white' }} >
                        Add
                    </Button>
                </Form.Item>
            </Form>
            <Table columns={columns} dataSource={orderList} />

            <div className="">
                <Button onClick={() => onOrderNow()} className="float-end my-2 h6 py-2" style={{ backgroundColor: 'orange', color: 'white' }} >
                    Order Now
                </Button>
            </div>
            <br></br>
            <br></br>

        </>
    );
}