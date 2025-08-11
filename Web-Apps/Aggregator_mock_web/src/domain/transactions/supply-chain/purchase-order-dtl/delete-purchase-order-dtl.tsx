import { Link } from "react-router-dom";
import ApiService from "../../../../tech/core/common/services/ApiServices";

const DeletePurchaseOrderDtl = (modalData: any) => {
    const onDelete = async (record: any) => {
        var data = { purchaseOrderDtlSno: record?.purchaseOrderDtlSno }
        const result = await ApiService('8912', 'post', 'delete_purchase_order_dtl', data, null);
        if (result) {
            modalData.event();
        }
    }
    return (
        <div className="modal custom-modal fade" id="delete_purchase_order_dtl" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="success-message text-center">
                            <div className="success-popup-icon">
                                <i className="ti ti-trash-x" />
                            </div>
                            <h3>Remove PurchaseOrderDtl?</h3>
                            <p className="del-info">Are you sure you want to remove it.</p>
                            <div className="col-lg-12 text-center modal-btn">
                                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                                    Cancel
                                </Link>
                                <Link to="#" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => onDelete(modalData?.modalData)}>
                                    Yes, Delete it
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletePurchaseOrderDtl;
