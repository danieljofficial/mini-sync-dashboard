import React, { useState } from "react";
import { useCreateActivity } from "../../hooks/useCreateActivity";
import { type CreateActivityInput } from "../../types/activity";
import { useActivities } from "../../hooks/useActivities";

interface CreateActivityFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  title?: string;
  message?: string;
  category?: string;
  expiresAt?: string;
}

export const CreateActivityForm: React.FC<CreateActivityFormProps> = ({
  onSuccess,
}) => {
  const { createActivity, loading, error } = useCreateActivity();

  const [formData, setFormData] = useState<CreateActivityInput>({
    title: "",
    message: "",
    category: "Maintenance",
    expiresAt: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [_isSubmitting, setIsSubmitting] = useState(false);

  const { refetch } = useActivities();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = "Expiration date is required";
    } else {
      const expiresAt = new Date(formData.expiresAt);
      if (expiresAt <= new Date()) {
        newErrors.expiresAt = "Expiration date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createActivity(formData);
      setFormData({
        title: "",
        message: "",
        category: "Maintenance",
        expiresAt: "",
      });
      setErrors({});
      onSuccess?.();
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to create activity:", err);
    } finally {
      setTimeout(() => {
        () => refetch();
      }, 3000);

      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Activity
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800 font-semibold">Error</div>
          <div className="text-red-600 mt-1">{error.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter activity title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter activity message"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Select a category</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Feature">Feature</option>
            <option value="Update">Update</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="expiresAt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Expires At *
          </label>
          <input
            type="datetime-local"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expiresAt ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.expiresAt && (
            <p className="mt-1 text-sm text-red-600">{errors.expiresAt}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Activity...
            </>
          ) : (
            "Create Activity"
          )}{" "}
        </button>
      </form>
    </div>
  );
};
