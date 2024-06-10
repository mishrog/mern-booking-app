import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // run this code after 5000ms
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer); // resets or clears the timer
    };
  }, [onClose]); // this hook will run the first time the component is rendered and when the onClose function changes
  const styles =
    type === "SUCCESS"
      ? "fixed top-4 right-4 z-50 p4 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-4 right-4 z-50 p4 rounded-md bg-red-600 text-white max-w-md";
  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;