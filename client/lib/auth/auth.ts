import { RegisterFormData, ApiResponse, LoginFormData, LoginResponse } from "../../types/auth";
import axiosClient from "../axios-client";

export const registerUser = async (data: RegisterFormData): Promise<ApiResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...registerData } = data;

  const response = await axiosClient.post<ApiResponse>("/users/register", registerData);
  return response.data;
};

export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/users/login", data);
  
  return response.data; 
};