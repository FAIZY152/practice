export interface User {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
}

export interface LoginResponse {
  success?: string;
  error?: string;
  user?: User;
}
