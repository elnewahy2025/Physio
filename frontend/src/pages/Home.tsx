import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { HealthStatus } from "@physio/contracts";

export function Home() {
  const { data: health, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.health(),
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Physio Center
        </h2>
        <p className="text-gray-600 mb-4">
          Physiotherapy Center Management System for Egypt
        </p>
        <p className="text-sm text-gray-500">
          Default timezone: Africa/Cairo | Currency: EGP (ج.م.)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          API Status
        </h3>
        {isLoading && <p className="text-gray-500">Checking...</p>}
        {error && (
          <p className="text-red-500">Error: {(error as Error).message}</p>
        )}
        {health && (
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                health.status === "ok" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-gray-700">
              Status: {health.status}
            </span>
            <span className="text-gray-500">({health.service})</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/patients"
            className="block bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
          >
            <span className="text-blue-600 font-medium">Patients</span>
          </a>
          <a
            href="/appointments"
            className="block bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors"
          >
            <span className="text-green-600 font-medium">Appointments</span>
          </a>
          <a
            href="/invoices"
            className="block bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors"
          >
            <span className="text-purple-600 font-medium">Invoices</span>
          </a>
        </div>
      </div>
    </div>
  );
}
