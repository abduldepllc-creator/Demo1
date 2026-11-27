export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
