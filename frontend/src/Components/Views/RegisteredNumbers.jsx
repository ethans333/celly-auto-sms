import eye from "../../assets/eye-solid.svg";
import square from "../../assets/square-regular.svg";
import numbers from "../../assets/numbers.json";
import { useEffect, useState } from "react";
export default function () {
  const [lsbWidth, setLsbWidth] = useState(0);

  useEffect(() => {
    const lsbElement = document.getElementById("lsb");
    if (!lsbElement) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === lsbElement) {
          setLsbWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(lsbElement);

    return () => {
      observer.unobserve(lsbElement);
    };
  }, []);

  return (
    <div style={{ marginLeft: `${lsbWidth}px` }}>
      <div className="flex justify-center">
        <div className="mt-[10vh] overflow-y-scroll max-h-[80vh] p-5">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 tracking-wide"></th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 tracking-wide"
                  >
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Registered
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 tracking-wide"
                  >
                    Last Contacted
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide"></th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((number, i) => (
                  <Row key={i} {...number} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ phone, date_registered, date_last_contacted, location }) {
  return (
    <tr className="border-b border-gray-200">
      <td className="px-6 py-4">
        <img
          src={square}
          className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
        />
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
      >
        {phone}
      </th>
      <td className="px-6 py-4">{date_registered}</td>
      <td className="px-6 py-4 bg-gray-50">{date_last_contacted}</td>
      <td className="px-6 py-4">{location}</td>
      <td className="px-6 py-4">
        <img
          src={eye}
          className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
        />
      </td>
    </tr>
  );
}
