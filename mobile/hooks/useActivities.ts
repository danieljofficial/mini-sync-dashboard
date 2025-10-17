import { useEffect, useState } from "react";
import { graphqlClient } from "../lib/graphql-client";
import { Activity } from "../types/activity";

const GET_ACTIVE_ACTIVITIES_QUERY = `
  query GetActiveActivities {
    getActiveActivities {
      _id
      title
      message
      category
      createdAt
      expiresAt
      isActive
    }
  }
`;

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = async () => {
    try {
      setError(null);
      const data = await graphqlClient.query<{
        getActiveActivities: Activity[];
      }>(GET_ACTIVE_ACTIVITIES_QUERY);
      setActivities(data.getActiveActivities);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchActivities();
  };

  return {
    activities,
    loading,
    error,
    refetch,
  };
};
