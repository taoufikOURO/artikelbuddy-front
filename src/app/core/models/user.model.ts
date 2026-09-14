export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserCreate {
  pseudo: string;
  email: string;
  password: string;
  password_confirmation: string;
  level: Level;
}

export interface UserLogin {
  identifier: string;
  password: string;
}

export interface UserOut {
  id: string;
  pseudo: string;
  email: string;
  level: Level;
  email_validated_at: string | null;
}

export interface OTPValidate {
  email: string;
  otp_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp_code: string;
  new_password: string;
  new_password_confirmation: string;
}
