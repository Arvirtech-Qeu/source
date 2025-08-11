import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const SkuTraceWfModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ wfStageCd: '',actionTime: '',actionBy: '',reference: '',description: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_skuTraceWf" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit SkuTraceWf</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add SkuTraceWf</h5>
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
                               wfStageCd: Yup.string().required(' Wf Stage Cd is required'),actionTime: Yup.string().required(' Action Time is required'),actionBy: Yup.string().required(' Action By is required'),reference: Yup.string().required('Reference is required'),description: Yup.string().required('Description is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_sku_trace_wf', data, null);
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
                                        const result = await ApiService('8912', 'post', 'create_sku_trace_wf', data, null);
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
                                         Wf Stage Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="wfStageCd" placeholder=' Wf Stage Cd' />
                                    <ErrorMessage name="wfStageCd" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Action Time <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="actionTime" placeholder=' Action Time' />
                                    <ErrorMessage name="actionTime" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Action By <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="actionBy" placeholder=' Action By' />
                                    <ErrorMessage name="actionBy" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                        Reference <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="reference" placeholder='Reference' />
                                    <ErrorMessage name="reference" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="description" placeholder='Description' />
                                    <ErrorMessage name="description" component="div" className="text-danger" />
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

export default SkuTraceWfModal;
