export default function () {
  return (
    <>
      <div className="flex space-x-5 w-[900px] grid grid-cols-2 p-5">
        <div className="shadow-lg border px-10 py-5 rounded-lg">
          <div className="font-bold text-2xl mt-5 px-3 py-1.5">Regular</div>
          <div className="space-y-2 text-gray-800 pt-8 pb-16">
            <p>• Nostrud non nulla in sunt voluptate tempor.</p>
            <p>• Cillum fugiat sit eu enim.</p>
            <p>
              • Lorem sit consequat culpa consequat aute laborum sunt tempor
              aliquip.
            </p>
            <p className="pt-3">
              Non aliqua quis amet amet laborum aliqua mollit.
            </p>
          </div>
        </div>

        <div className="shadow-lg shadow-indigo-500/30 border px-10 pt-5 rounded-lg">
          <div className="mt-5 -rotate-6 text-2xl font-bold mb-auto w-fit bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded shadow-lg shadow-indigo-500/50">
            Premium
          </div>
          <div className="space-y-2 text-gray-800 pt-8 pb-16">
            <p>• Nostrud non nulla in sunt voluptate tempor.</p>
            <p>• Cillum fugiat sit eu enim.</p>
            <p>
              • Lorem sit consequat culpa consequat aute laborum sunt tempor
              aliquip.
            </p>
            <p>• Non aliqua quis amet amet laborum aliqua mollit.</p>
            <p>• Cillum fugiat sit eu enim.</p>
            <p className="pt-3 pb-7">
              Non aliqua quis amet amet laborum aliqua mollit.
            </p>
            <div className="cursor-pointer ml-auto hover:opacity-50 font-bold mb-auto w-fit bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded shadow-lg shadow-indigo-500/50">
              Upgrade
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
