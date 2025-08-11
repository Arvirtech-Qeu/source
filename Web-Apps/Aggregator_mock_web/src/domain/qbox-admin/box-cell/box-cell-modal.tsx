import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../tech/core/common/services/ApiServices';

const BoxCellModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ qboxEntitySno: '',entityInfraSno: '',rowNo: '',columnNo: '',boxCellStatusCd: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_boxCell" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit BoxCell</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add BoxCell</h5>
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
                               qboxEntitySno: Yup.string().required(' Qbox Entity Sno is required'),entityInfraSno: Yup.string().required(' Entity Infra Sno is required'),rowNo: Yup.string().required(' Row No is required'),columnNo: Yup.string().required(' Column No is required'),boxCellStatusCd: Yup.string().required(' Box Cell Status Cd is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_box_cell', data, null);
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
                                        const result = await ApiService('8912', 'post', 'create_box_cell', data, null);
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
                                         Qbox Entity Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="qboxEntitySno" placeholder=' Qbox Entity Sno' />
                                    <ErrorMessage name="qboxEntitySno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Entity Infra Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="entityInfraSno" placeholder=' Entity Infra Sno' />
                                    <ErrorMessage name="entityInfraSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Row No <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="rowNo" placeholder=' Row No' />
                                    <ErrorMessage name="rowNo" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Column No <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="columnNo" placeholder=' Column No' />
                                    <ErrorMessage name="columnNo" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Box Cell Status Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="boxCellStatusCd" placeholder=' Box Cell Status Cd' />
                                    <ErrorMessage name="boxCellStatusCd" component="div" className="text-danger" />
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

export default BoxCellModal;
