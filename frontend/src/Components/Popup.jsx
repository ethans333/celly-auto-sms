import xmark from "../assets/xmark-solid.svg";

export default function ({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-fit">
        <img
          className="w-4 cursor-pointer ml-auto"
          src={xmark}
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
}
