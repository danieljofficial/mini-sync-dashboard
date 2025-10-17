import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { type CreateActivityInput, type Activity } from "../types/activity";

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(createActivityInput: $input) {
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

export const useCreateActivity = () => {
  const [createActivity, { loading, error }] = useMutation<
    {
      createActivity: Activity;
    },
    {
      input: CreateActivityInput;
    }
  >(CREATE_ACTIVITY);

  return {
    createActivity: (input: CreateActivityInput) =>
      createActivity({ variables: { input } }),
    loading,
    error,
  };
};
