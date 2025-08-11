import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const CityModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ countrySno: '', stateSno: '', name: '' });
    const [countries, setCountries] = useState([]); // State to hold country data
    const [states, setStates] = useState([]); // State to hold country data

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    useEffect(() => {
        // Fetch countries
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const data = {};
            const result = await ApiService('8911', 'post', 'search_country', data, null);
            if (result && result.data) {
                setCountries(result.data); // Set countries in state
            }
        } catch (error) {
            console.error('Error fetching countries', error);
        }
    };

    const fetchStates = async () => {
        try {
            const data = {};
            const result = await ApiService('8911', 'post', 'search_state', data, null);
            if (result && result.data) {
                setStates(result.data); // Set countries in state
            }
        } catch (error) {
            console.error('Error fetching countries', error);
        }
    };

    useEffect(() => {
        // Fetch countries
        fetchCountries();
        fetchStates();
    }, []);

    return (
        <div className="modal custom-modal fade" id="add_city" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit City</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add City</h5>
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
                                countrySno: Yup.string().required(' Country Sno is required'), stateSno: Yup.string().required(' State Sno is required'), name: Yup.string().required('Name is required')
                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8911', 'put', 'edit_city', data, null);
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
                                        const result = await ApiService('8911', 'post', 'create_city', data, null);
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
                                        Country <span className="text-danger">*</span>
                                    </label>
                                    <Field as="select" name="countrySno" className="form-control">
                                        <option value="">Select Country</option>
                                        {countries.map((country: any) => (
                                            <option key={country.countrySno} value={country.countrySno}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="countrySno" component="div" className="text-danger" />
                                </div>

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        State <span className="text-danger">*</span>
                                    </label>
                                    <Field as="select" name="stateSno" className="form-control">
                                        <option value="">Select State</option>
                                        {states.map((state: any) => (
                                            <option key={state.stateSno} value={state.stateSno}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="countrySno" component="div" className="text-danger" />
                                </div>

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="name" placeholder='Name' />
                                    <ErrorMessage name="name" component="div" className="text-danger" />
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

export default CityModal;