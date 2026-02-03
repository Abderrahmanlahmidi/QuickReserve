export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  userId?: string;
}
