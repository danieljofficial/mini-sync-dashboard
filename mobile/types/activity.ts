export interface Activity {
  id: string;
  title: string;
  message: string;
  category: "Maintenance" | "Feature" | "Update";
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}
