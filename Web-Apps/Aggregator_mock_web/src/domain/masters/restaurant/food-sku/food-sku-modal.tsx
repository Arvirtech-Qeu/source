import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const FoodSkuModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ restaurantBrandCd: '',foodName: '',skuCode: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_foodSku" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit FoodSku</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add FoodSku</h5>
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
                               restaurantBrandCd: Yup.string().required(' Restaurant Brand Cd is required'),foodName: Yup.string().required(' Food Name is required'),skuCode: Yup.string().required(' Sku Code is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_food_sku', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_food_sku', data, null);
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
                                         Food Name <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="foodName" placeholder=' Food Name' />
                                    <ErrorMessage name="foodName" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Sku Code <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="skuCode" placeholder=' Sku Code' />
                                    <ErrorMessage name="skuCode" component="div" className="text-danger" />
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

export default FoodSkuModal;
