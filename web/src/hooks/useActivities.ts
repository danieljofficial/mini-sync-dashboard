import { gql } from "@apollo/client";
import { useQuery, useSubscription } from "@apollo/client/react";
import { type Activity } from "../types/activity";
import { useEffect, useState } from "react";

export const GET_ACTIVITIES = gql`
  query GetActivities {
    getActivities {
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

const ACTIVITY_CREATED_SUBSCRIPTION = gql`
  subscription OnActivityCreated {
    activityCreated {
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
  const { data, loading, error, refetch } = useQuery<{
    getActivities: Activity[];
  }>(GET_ACTIVITIES);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivityNotification, setNewActivityNotification] =
    useState<Activity | null>(null);

  // Set initial activities when data loads
  useEffect(() => {
    if (data?.getActivities) {
      setActivities(data.getActivities);
    }
  }, [data?.getActivities]);

  // Subscribe to new activities
  const { data: subscriptionData } = useSubscription<{
    activityCreated: Activity;
  }>(ACTIVITY_CREATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.activityCreated) {
        const newActivity = data.data.activityCreated;

        // Show notification for new activity
        setNewActivityNotification(newActivity);

        // Add to activities list
        setActivities((prev) => [newActivity, ...prev]);

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNewActivityNotification(null);
        }, 5000);
      }
    },
  });

  const clearNotification = () => {
    setNewActivityNotification(null);
  };

  return {
    activities,
    loading,
    error,
    refetch,
    newActivityNotification,
    clearNotification,
  };
};
