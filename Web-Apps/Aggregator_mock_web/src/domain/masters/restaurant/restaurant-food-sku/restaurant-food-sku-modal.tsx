import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const RestaurantFoodSkuModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ restaurantSno: '',foodSkuSno: '',status: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_restaurantFoodSku" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit RestaurantFoodSku</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add RestaurantFoodSku</h5>
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
                               restaurantSno: Yup.string().required(' Restaurant Sno is required'),foodSkuSno: Yup.string().required(' Food Sku Sno is required'),status: Yup.string().required('Status is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_restaurant_food_sku', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_restaurant_food_sku', data, null);
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
                                         Restaurant Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="restaurantSno" placeholder=' Restaurant Sno' />
                                    <ErrorMessage name="restaurantSno" component="div" className="text-danger" />
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
                                        Status <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="status" placeholder='Status' />
                                    <ErrorMessage name="status" component="div" className="text-danger" />
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

export default RestaurantFoodSkuModal;
