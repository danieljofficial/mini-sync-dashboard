import React from "react";
import { useActivities } from "../../hooks/useActivities";

export const ActivityList: React.FC = () => {
  const {
    activities,
    loading,
    error,
    refetch,
    newActivityNotification,
    clearNotification,
  } = useActivities();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div className="text-gray-600">Loading activities...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-semibold">
          Error loading activities
        </div>
        <div className="text-red-600 mt-1">{error.message}</div>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">No activities found</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Current Activities</h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* New Activity Notification */}
      {newActivityNotification && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-green-800 font-semibold flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                New Activity Created!
              </div>
              <div className="text-green-600 mt-1">
                "{newActivityNotification.title}" was just added
              </div>
            </div>
            <button
              onClick={clearNotification}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
              newActivityNotification?.id === activity.id
                ? "border-green-300 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {activity.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.category === "Maintenance"
                    ? "bg-yellow-100 text-yellow-800"
                    : activity.category === "Feature"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {activity.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{activity.message}</p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                Created: {new Date(activity.createdAt).toLocaleDateString()}
              </span>
              <span>
                Expires: {new Date(activity.expiresAt).toLocaleDateString()}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  activity.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {activity.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
