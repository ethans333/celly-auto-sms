import eye from "../../assets/eye-solid.svg";
import square from "../../assets/square-regular.svg";
import numbers from "../../assets/numbers.json";
import { useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../App";
export default function () {
  const [lsbWidth, setLsbWidth] = useState(0);
  const [rsbWidth, setRsbWidth] = useState(0);

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
  const { setSideBarChildren } = useContext(WorkspaceContext);

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
          onClick={() =>
            setSideBarChildren(
              <div>
                <div className="max-w-96 space-y-5 mt-10 overflow-y-scroll pr-5 max-h-[90vh]">
                  <BubbleServer text="Reprehenderit quis reprehenderit irure in occaecat ipsum aliqua aliqua" />
                  <BubbleClient text="Lsunt dolor proident cupidatat." />
                  <BubbleServer text="Exercitation ullamco laboris." />
                  <BubbleClient text="Laboris adipisicing sunt." />
                  <BubbleServer text="Dolore culpa sunt ullamco occaecat nostrud nisi non ipsum amet dolor sint ipsum pariatur." />
                  <BubbleClient text="Esse Lorem nostrud nisi sint veniam sit. Ipsum elit eiusmod nulla id irure. Excepteur duis culpa sunt proident est irure proident ad pariatur in ut deserunt. Sint culpa laborum mollit quis." />
                  <BubbleServer text="Reprehenderit quis reprehenderit irure in occaecat ipsum aliqua aliqua" />
                  <BubbleClient text="Lsunt dolor proident cupidatat." />
                  <BubbleServer text="Exercitation ullamco laboris." />
                  <BubbleClient text="Laboris adipisicing sunt." />
                  <BubbleServer text="Dolore culpa sunt ullamco occaecat nostrud nisi non ipsum amet dolor sint ipsum pariatur." />
                  <BubbleClient text="Esse Lorem nostrud nisi sint veniam sit. Ipsum elit eiusmod nulla id irure. Excepteur duis culpa sunt proident est irure proident ad pariatur in ut deserunt. Sint culpa laborum mollit quis." />
                  <BubbleServer text="Reprehenderit quis reprehenderit irure in occaecat ipsum aliqua aliqua" />
                  <BubbleClient text="Lsunt dolor proident cupidatat." />
                  <BubbleServer text="Exercitation ullamco laboris." />
                  <BubbleClient text="Laboris adipisicing sunt." />
                  <BubbleServer text="Dolore culpa sunt ullamco occaecat nostrud nisi non ipsum amet dolor sint ipsum pariatur." />
                  <BubbleClient text="Esse Lorem nostrud nisi sint veniam sit. Ipsum elit eiusmod nulla id irure. Excepteur duis culpa sunt proident est irure proident ad pariatur in ut deserunt. Sint culpa laborum mollit quis." />
                  <BubbleServer text="Reprehenderit quis reprehenderit irure in occaecat ipsum aliqua aliqua" />
                  <BubbleClient text="Lsunt dolor proident cupidatat." />
                  <BubbleServer text="Exercitation ullamco laboris." />
                  <BubbleClient text="Laboris adipisicing sunt." />
                  <BubbleServer text="Dolore culpa sunt ullamco occaecat nostrud nisi non ipsum amet dolor sint ipsum pariatur." />
                  <BubbleClient text="Esse Lorem nostrud nisi sint veniam sit. Ipsum elit eiusmod nulla id irure. Excepteur duis culpa sunt proident est irure proident ad pariatur in ut deserunt. Sint culpa laborum mollit quis." />
                  <BubbleServer text="Reprehenderit quis reprehenderit irure in occaecat ipsum aliqua aliqua" />
                  <BubbleClient text="Lsunt dolor proident cupidatat." />
                  <BubbleServer text="Exercitation ullamco laboris." />
                  <BubbleClient text="Laboris adipisicing sunt." />
                  <BubbleServer text="Dolore culpa sunt ullamco occaecat nostrud nisi non ipsum amet dolor sint ipsum pariatur." />
                  <BubbleClient text="Esse Lorem nostrud nisi sint veniam sit. Ipsum elit eiusmod nulla id irure. Excepteur duis culpa sunt proident est irure proident ad pariatur in ut deserunt. Sint culpa laborum mollit quis." />
                </div>
                <div className="flex mt-4 space-x-3 justify-end mr-8">
                  <LegendLabel text="Server" color="#d1d5db" />
                  <LegendLabel text="Client" color="black" />
                </div>
              </div>
            )
          }
        />
      </td>
    </tr>
  );
}

function BubbleServer({ text }) {
  return (
    <div className="mr-5">
      <div className="text-sm bg-gray-100 px-5 py-2 mr-auto rounded-lg w-fit">
        {text}
      </div>
    </div>
  );
}

function BubbleClient({ text }) {
  return (
    <div className="ml-5">
      <div className="text-sm bg-black text-white px-5 py-2 rounded-lg ml-auto w-fit">
        {text}
      </div>
    </div>
  );
}

function LegendLabel({ text, color }) {
  return (
    <div className="flex items-center">
      <svg width="18" height="18">
        <rect width="15" height="15" x="0" y="0" rx="3" ry="3" fill={color} />
      </svg>
      <div className="text-sm">{text}</div>
    </div>
  );
}
