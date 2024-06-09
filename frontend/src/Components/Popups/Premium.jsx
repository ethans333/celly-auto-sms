export default function () {
  return (
    <>
      <div className="flex space-x-5 w-[900px] grid grid-cols-2 p-5 py-14">
        <div className="shadow-lg border px-10 py-5 rounded-lg">
          <div className="font-extrabold text-2xl mt-5 py-1.5 rounded w-fit">
            Core
          </div>
          <div className="space-y-2 text-gray-800 pt-8 pb-16">
            <ul className="list-disc ml-3">
              <li>
                Any Event Style (30 mins meetings, 1 hours meetings, and day
                meetings)
              </li>
              <li>Connect to Teams (Coming soon)</li>
              <li>Intwine on your website</li>
              <li>Intent gathering emails for clients</li>
              <li>Intent data credits</li>
              <li>Intent data available at Intwine.app</li>
              <li> Automated remiders for you and your clients</li>
              <li>Community access</li>
              <li>Monthly newsletter "Intake with Intwine"</li>
              <li>Email support</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            boxShadow: "0px 0px 20px rgb(79, 70, 229, 0.3)",
          }}
          className="border px-10 pt-5 rounded-lg"
        >
          <div className="mt-5 -rotate-6 text-2xl font-extrabold mb-auto w-fit bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded shadow-lg shadow-indigo-500/50">
            Core +
          </div>
          <div className="space-y-2 text-gray-800 pt-8 pb-16">
            <ul className="list-disc ml-3 mb-10">
              <li>Access to Workflow product</li>
              <li>Connect and build workflows with LegalServer</li>
              <li>Connect and build workflows with SMS.</li>
              <li>Connect and build workflows with Teams.</li>
              <li>Connect and build workflows with Zoom.</li>
              <li>Intent gathering texts for clients</li>
              <li>Intent Premium data credits</li>
              <li>Intent data available daily via email.</li>
              <li>Automated emails to you with Intent data</li>
              <li>Chat support</li>
            </ul>
            <div className="cursor-pointer ml-auto hover:opacity-50 font-extrabold mb-auto w-fit bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded shadow-lg shadow-indigo-500/50">
              Upgrade Now
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
