import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const CodesDtlModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ codesHdrSno: '',cdValue: '',seqno: '',filter1: '',filter2: '',activeFlag: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_codesDtl" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit CodesDtl</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add CodesDtl</h5>
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
                               codesHdrSno: Yup.string().required(' Codes Hdr Sno is required'),cdValue: Yup.string().required(' Cd Value is required'),seqno: Yup.string().required('Seqno is required'),filter1: Yup.string().required(' Filter 1 is required'),filter2: Yup.string().required(' Filter 2 is required'),activeFlag: Yup.string().required(' Active Flag is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_codes_dtl', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_codes_dtl', data, null);
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
                                         Codes Hdr Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="codesHdrSno" placeholder=' Codes Hdr Sno' />
                                    <ErrorMessage name="codesHdrSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Cd Value <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="cdValue" placeholder=' Cd Value' />
                                    <ErrorMessage name="cdValue" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                        Seqno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="seqno" placeholder='Seqno' />
                                    <ErrorMessage name="seqno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Filter 1 <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="filter1" placeholder=' Filter 1' />
                                    <ErrorMessage name="filter1" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Filter 2 <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="filter2" placeholder=' Filter 2' />
                                    <ErrorMessage name="filter2" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Active Flag <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="activeFlag" placeholder=' Active Flag' />
                                    <ErrorMessage name="activeFlag" component="div" className="text-danger" />
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

export default CodesDtlModal;
