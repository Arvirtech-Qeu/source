import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../tech/core/common/services/ApiServices';

const QboxEntityDeliveryPartnerModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ deliveryTypeCd: '',qboxEntitySno: '',deliveryPartnerSno: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_qboxEntityDeliveryPartner" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit QboxEntityDeliveryPartner</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add QboxEntityDeliveryPartner</h5>
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
                               deliveryTypeCd: Yup.string().required(' Delivery Type Cd is required'),qboxEntitySno: Yup.string().required(' Qbox Entity Sno is required'),deliveryPartnerSno: Yup.string().required(' Delivery Partner Sno is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_qbox_entity_delivery_partner', data, null);
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
                                        const result = await ApiService('8912', 'post', 'create_qbox_entity_delivery_partner', data, null);
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
                                         Delivery Type Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="deliveryTypeCd" placeholder=' Delivery Type Cd' />
                                    <ErrorMessage name="deliveryTypeCd" component="div" className="text-danger" />
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

export default QboxEntityDeliveryPartnerModal;
