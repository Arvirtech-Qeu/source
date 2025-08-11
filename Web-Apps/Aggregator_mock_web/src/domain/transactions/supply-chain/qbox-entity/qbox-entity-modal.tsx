import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const QboxEntityModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ qboxEntityName: '',addressSno: '',areaSno: '',qboxEntityStatusCd: '',createdOn: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_qboxEntity" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit QboxEntity</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add QboxEntity</h5>
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
                               qboxEntityName: Yup.string().required(' Qbox Entity Name is required'),addressSno: Yup.string().required(' Address Sno is required'),areaSno: Yup.string().required(' Area Sno is required'),qboxEntityStatusCd: Yup.string().required(' Qbox Entity Status Cd is required'),createdOn: Yup.string().required(' Created On is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_qbox_entity', data, null);
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
                                        const result = await ApiService('8912', 'post', 'create_qbox_entity', data, null);
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
                                         Qbox Entity Name <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="qboxEntityName" placeholder=' Qbox Entity Name' />
                                    <ErrorMessage name="qboxEntityName" component="div" className="text-danger" />
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
                                         Qbox Entity Status Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="qboxEntityStatusCd" placeholder=' Qbox Entity Status Cd' />
                                    <ErrorMessage name="qboxEntityStatusCd" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Created On <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="createdOn" placeholder=' Created On' />
                                    <ErrorMessage name="createdOn" component="div" className="text-danger" />
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

export default QboxEntityModal;
