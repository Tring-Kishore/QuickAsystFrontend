import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
  position: "top-center" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light" as const,
};
export const ToastNotification = () => (
  <ToastContainer {...toastConfig} />
);
export const showSuccessToast = (message: string) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message: string) => {
  toast.error(message, toastConfig);
};

export const showInfoToast = (message: string) => {
  toast.info(message, toastConfig);
};

export const showWarningToast = (message: string) => {
  toast.warning(message, toastConfig);
};
