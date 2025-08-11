import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import ApiService from '../../../../tech/core/common/services/ApiServices';

const SkuInventoryModal = (modalData: any) => {
    const [initialValues, setInitialValues] = useState({ purchaseOrderDtlSno: '',uniqueCode: '',salesOrderDtlSno: '',wfStageCd: '' });

    useEffect(() => {
        console.log(modalData)
        if (modalData?.modalData) {
            setInitialValues(modalData?.modalData);
        } else {
            setInitialValues(initialValues)
        }
    }, [modalData]);


    return (
        <div className="modal custom-modal fade" id="add_skuInventory" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">

                        {modalData?.modalData ? (
                            <>
                                <h5 className="modal-title">Edit SkuInventory</h5>
                            </>
                        ) : (
                            <>
                                <h5 className="modal-title">Add SkuInventory</h5>
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
                               purchaseOrderDtlSno: Yup.string().required(' Purchase Order Dtl Sno is required'),uniqueCode: Yup.string().required(' Unique Code is required'),salesOrderDtlSno: Yup.string().required(' Sales Order Dtl Sno is required'),wfStageCd: Yup.string().required(' Wf Stage Cd is required')                            })}
                            onSubmit={async (values, { resetForm }) => {
                                console.log('Form submitted:', values);
                                if (modalData?.modalData) {
                                    try {
                                        const data = values;
                                        const result = await ApiService('8912', 'put', 'edit_sku_inventory', data, null);
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
                                        const result = await ApiService('8912', 'post', 'create_sku_inventory', data, null);
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
                                         Purchase Order Dtl Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="purchaseOrderDtlSno" placeholder=' Purchase Order Dtl Sno' />
                                    <ErrorMessage name="purchaseOrderDtlSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Unique Code <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="uniqueCode" placeholder=' Unique Code' />
                                    <ErrorMessage name="uniqueCode" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Sales Order Dtl Sno <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="salesOrderDtlSno" placeholder=' Sales Order Dtl Sno' />
                                    <ErrorMessage name="salesOrderDtlSno" component="div" className="text-danger" />
                                </div>

<div className="form-wrap">
                                    <label className="col-form-label">
                                         Wf Stage Cd <span className="text-danger">*</span>
                                    </label>
                                    <Field type="text" className="form-control" name="wfStageCd" placeholder=' Wf Stage Cd' />
                                    <ErrorMessage name="wfStageCd" component="div" className="text-danger" />
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

export default SkuInventoryModal;
