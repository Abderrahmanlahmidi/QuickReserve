import { RegisterFormData, ApiResponse } from "../../types/auth";
import axiosClient from "../axios-client";

export const registerUser = async (data: RegisterFormData): Promise<ApiResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...registerData } = data;

  const response = await axiosClient.post<ApiResponse>("/users/register", registerData);
  return response;
};