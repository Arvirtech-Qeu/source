import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const AreaModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ countrySno: '', stateSno: '', citySno: '', name: '', pincode: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_area" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit Area</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add Area</h5>
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
                                countrySno: Yup.string().required(' Country Sno is required'), stateSno: Yup.string().required(' State Sno is required'), citySno: Yup.string().required(' City Sno is required'), name: Yup.string().required('Name is required'), pincode: Yup.string().required('Pincode is required')
                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_area', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_area', data, null);
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
                                        Country Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="countrySno" placeholder=' Country Sno' />
                                    <ErrorMessage name="countrySno" component="div" className="text-danger" />
                                </div>

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        State Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="stateSno" placeholder=' State Sno' />
                                    <ErrorMessage name="stateSno" component="div" className="text-danger" />
                                </div>

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        City Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="citySno" placeholder=' City Sno' />
                                    <ErrorMessage name="citySno" component="div" className="text-danger" />
                                </div>

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="name" placeholder='Name' />
                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                </div>

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Pincode <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="pincode" placeholder='Pincode' />
                                    <ErrorMessage name="pincode" component="div" className="text-danger" />
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

export default AreaModal;