import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">NEA Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/client/arcgis" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                ArcGIS Map
              </h2>
              <p className="text-gray-600">
                View locations on an interactive map
              </p>
            </div>
          </Link>
          <Link href="/client/drilldown" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Drilldown
              </h2>
              <p className="text-gray-600">Drilldown KPIs </p>
            </div>
          </Link>{" "}
          <Link href="/client/filter" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Filters
              </h2>
              <p className="text-gray-600">Data Filters </p>
            </div>
          </Link>
          <Link href="/client/mainpage" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Main Page
              </h2>
              <p className="text-gray-600">Main Page </p>
            </div>
          </Link>
          <Link href="/client/weatherpage" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Weather Page
              </h2>
              <p className="text-gray-600">Weather Page </p>
            </div>
          </Link>
          {/* Add more dashboard cards here as needed */}
        </div>
      </div>
    </div>
  );
}
