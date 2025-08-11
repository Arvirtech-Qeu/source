import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const SalesOrderDtlModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ salesOrderSno: '',partnerFoodCode: '',foodSkuSno: '',orderQuantity: '',skuPrice: '',deliveredQuantity: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_salesOrderDtl" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit SalesOrderDtl</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add SalesOrderDtl</h5>
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
                               salesOrderSno: Yup.string().required(' Sales Order Sno is required'),partnerFoodCode: Yup.string().required(' Partner Food Code is required'),foodSkuSno: Yup.string().required(' Food Sku Sno is required'),orderQuantity: Yup.string().required(' Order Quantity is required'),skuPrice: Yup.string().required(' Sku Price is required'),deliveredQuantity: Yup.string().required(' Delivered Quantity is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_sales_order_dtl', data, null);
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
                                        const result = await ApiService('8912', 'post', 'create_sales_order_dtl', data, null);
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
                                         Sales Order Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="salesOrderSno" placeholder=' Sales Order Sno' />
                                    <ErrorMessage name="salesOrderSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Partner Food Code <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="partnerFoodCode" placeholder=' Partner Food Code' />
                                    <ErrorMessage name="partnerFoodCode" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Food Sku Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="foodSkuSno" placeholder=' Food Sku Sno' />
                                    <ErrorMessage name="foodSkuSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Order Quantity <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="orderQuantity" placeholder=' Order Quantity' />
                                    <ErrorMessage name="orderQuantity" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Sku Price <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="skuPrice" placeholder=' Sku Price' />
                                    <ErrorMessage name="skuPrice" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Delivered Quantity <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="deliveredQuantity" placeholder=' Delivered Quantity' />
                                    <ErrorMessage name="deliveredQuantity" component="div" className="text-danger" />
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

export default SalesOrderDtlModal;
