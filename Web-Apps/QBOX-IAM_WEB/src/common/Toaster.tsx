import { ToastContainer, toast, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toaster = () => {
  return <ToastContainer />;
};

// Store the ID of the currently active toast
let activeToastId: Id | null = null;

export const showToast = (
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  // If a toast is already active, do nothing
  if (activeToastId) {
    return;
  }

  // Show the toast and store its ID
  switch (type) {
    case 'info':
      activeToastId = toast.info(message, {
        onClose: () => (activeToastId = null) // Reset ID when toast is closed
      });
      break;
    case 'success':
      activeToastId = toast.success(message, {
        onClose: () => (activeToastId = null)
      });
      break;
    case 'warning':
      activeToastId = toast.warn(message, {
        onClose: () => (activeToastId = null)
      });
      break;
    case 'error':
      activeToastId = toast.error(message, {
        onClose: () => (activeToastId = null)
      });
      break;
    default:
      activeToastId = toast(message, {
        onClose: () => (activeToastId = null)
      });
  }
};