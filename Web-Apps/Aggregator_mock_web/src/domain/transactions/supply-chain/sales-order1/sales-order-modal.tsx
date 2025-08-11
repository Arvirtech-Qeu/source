import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const SalesOrderModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ partnerSalesOrderId: '',qboxEntitySno: '',deliveryPartnerSno: '',salesOrderStatusCd: '',orderedTime: '',orderedBy: '',partnerCustomerRef: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_salesOrder" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit SalesOrder</h5>
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
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize={true}
                            validationSchema={Yup.object({
                               partnerSalesOrderId: Yup.string().required(' Partner Sales Order Id is required'),qboxEntitySno: Yup.string().required(' Qbox Entity Sno is required'),deliveryPartnerSno: Yup.string().required(' Delivery Partner Sno is required'),salesOrderStatusCd: Yup.string().required(' Sales Order Status Cd is required'),orderedTime: Yup.string().required(' Ordered Time is required'),orderedBy: Yup.string().required(' Ordered By is required'),partnerCustomerRef: Yup.string().required(' Partner Customer Ref is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_sales_order', data, null);
                                        console.log(result)
                                        if (result) {
                                            modalData.event();
                                            resetForm();
                                            const closeButton: any = document.querySelector('.btn-close');
                                            closeButton.click();
                                        }
                                    }
                                    catch (error) {
                                        console.error('Error fetching projects roles', error);
                                    }
                                } else {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'post', 'create_sales_order', data, null);
                                        console.log(result)
                                        if (result) {
                                            resetForm();
                                            modalData.event();
                                            const closeButton: any = document.querySelector('.btn-close');
                                            closeButton.click();
                                        }
                                    }
                                    catch (error) {
                                        console.error('Error fetching projects roles', error);
                                    }
                                }


                            }}
                        >
                            <Form>
                                
<div className="form-wrap">
                                    <label className="col-form-label">
                                         Partner Sales Order Id <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="partnerSalesOrderId" placeholder=' Partner Sales Order Id' />
                                    <ErrorMessage name="partnerSalesOrderId" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Qbox Entity Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="qboxEntitySno" placeholder=' Qbox Entity Sno' />
                                    <ErrorMessage name="qboxEntitySno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Delivery Partner Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="deliveryPartnerSno" placeholder=' Delivery Partner Sno' />
                                    <ErrorMessage name="deliveryPartnerSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Sales Order Status Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="salesOrderStatusCd" placeholder=' Sales Order Status Cd' />
                                    <ErrorMessage name="salesOrderStatusCd" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Ordered Time <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="orderedTime" placeholder=' Ordered Time' />
                                    <ErrorMessage name="orderedTime" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Ordered By <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="orderedBy" placeholder=' Ordered By' />
                                    <ErrorMessage name="orderedBy" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Partner Customer Ref <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="partnerCustomerRef" placeholder=' Partner Customer Ref' />
                                    <ErrorMessage name="partnerCustomerRef" component="div" className="text-danger" />
                                </div>
                                <div className="modal-btn">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                                        Cancel
                                    </button>

                                    {modalData?.modalData ? (
                                        <>
                                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                                Edit
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                                Create
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default SalesOrderModal;
