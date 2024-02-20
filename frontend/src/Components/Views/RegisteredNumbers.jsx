import eye from "../../assets/eye-solid.svg";
import square from "../../assets/square-regular.svg";
import numbers from "../../assets/numbers.json";

export default function () {
  return (
    <div className="ml-96">
      <div className="flex justify-center">
        <div className="mt-[10vh] overflow-y-scroll max-h-[80vh] p-5">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-gray-700 uppercase">
                <tr>
                  <th scope="col" class="px-6 py-3 tracking-wide"></th>
                  <th scope="col" class="px-6 py-3 bg-gray-50 tracking-wide">
                    Phone Number
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Date Registered
                  </th>
                  <th scope="col" class="px-6 py-3 bg-gray-50 tracking-wide">
                    Last Contacted
                  </th>
                  <th scope="col" class="px-6 py-3 tracking-wide">
                    Location
                  </th>
                  <th scope="col" class="px-6 py-3 tracking-wide"></th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((number) => (
                  <Row {...number} />
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
    <tr class="border-b border-gray-200">
      <td class="px-6 py-4">
        <img
          src={square}
          className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
        />
      </td>
      <th
        scope="row"
        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
      >
        {phone}
      </th>
      <td class="px-6 py-4">{date_registered}</td>
      <td class="px-6 py-4 bg-gray-50">{date_last_contacted}</td>
      <td class="px-6 py-4">{location}</td>
      <td class="px-6 py-4">
        <img
          src={eye}
          className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
        />
      </td>
    </tr>
  );
}
