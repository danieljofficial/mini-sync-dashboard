import { ApolloProvider } from "@apollo/client/react";
import "./App.css";
import { apolloClient } from "./lib/apollo-client";
import { ActivityList } from "./components/activitylist";
import { CreateActivityForm } from "./components/create-activity-form";
import { useState } from "react";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityCreated = () => {
    // Trigger refresh of activity list
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Mini Sync Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Admin panel for managing user activities
            </p>
          </header>
          <main className="space-y-8">
            <CreateActivityForm onSuccess={handleActivityCreated} />
            <ActivityList key={refreshKey} />
          </main>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
