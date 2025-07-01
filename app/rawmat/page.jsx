export default function CreateRawMaterialPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white border border-slate-200 rounded-lg shadow p-8">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-3">
        Create Raw Material
      </h1>

      <form className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
           Raw Material Name
          </label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Short Name
          </label>
          <input
            type="text"
            placeholder="Short code"
            className="w-full border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Quantity Used
          </label>
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add Material
          </button>
        </div>
      </form>
    </div>
  );
}
