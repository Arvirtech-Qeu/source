import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const RestaurantModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ restaurantBrandCd: '',restaurantName: '',addressSno: '',areaSno: '',restaurantStatusCd: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_restaurant" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit Restaurant</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add Restaurant</h5>
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
                               restaurantBrandCd: Yup.string().required(' Restaurant Brand Cd is required'),restaurantName: Yup.string().required(' Restaurant Name is required'),addressSno: Yup.string().required(' Address Sno is required'),areaSno: Yup.string().required(' Area Sno is required'),restaurantStatusCd: Yup.string().required(' Restaurant Status Cd is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_restaurant', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_restaurant', data, null);
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
                                         Restaurant Brand Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="restaurantBrandCd" placeholder=' Restaurant Brand Cd' />
                                    <ErrorMessage name="restaurantBrandCd" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Restaurant Name <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="restaurantName" placeholder=' Restaurant Name' />
                                    <ErrorMessage name="restaurantName" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Address Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="addressSno" placeholder=' Address Sno' />
                                    <ErrorMessage name="addressSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Area Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="areaSno" placeholder=' Area Sno' />
                                    <ErrorMessage name="areaSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Restaurant Status Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="restaurantStatusCd" placeholder=' Restaurant Status Cd' />
                                    <ErrorMessage name="restaurantStatusCd" component="div" className="text-danger" />
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

export default RestaurantModal;
