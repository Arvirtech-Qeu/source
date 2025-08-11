import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const CountryModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ name: '',iso2: '',phoneCode: '',numericCode: '',currencyCode: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_country" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit Country</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add Country</h5>
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
                               name: Yup.string().required('Name is required'),iso2: Yup.string().required('Iso2 is required'),phoneCode: Yup.string().required(' Phone Code is required'),numericCode: Yup.string().required(' Numeric Code is required'),currencyCode: Yup.string().required(' Currency Code is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_country', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_country', data, null);
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
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="name" placeholder='+91' />
                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                        Iso2 <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="iso2" placeholder='+91' />
                                    <ErrorMessage name="iso2" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Phone Code <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="phoneCode" placeholder='+91' />
                                    <ErrorMessage name="phoneCode" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Numeric Code <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="numericCode" placeholder='+91' />
                                    <ErrorMessage name="numericCode" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Currency Code <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="currencyCode" placeholder='+91' />
                                    <ErrorMessage name="currencyCode" component="div" className="text-danger" />
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

export default CountryModal;