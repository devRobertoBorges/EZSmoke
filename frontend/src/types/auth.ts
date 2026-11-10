export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

// Resposta de /api/auth/me
export interface CurrentUser extends User {
  isPremium: boolean;
}

// Resposta de /api/auth/login
export interface LoginResult {
  token: string;
  user: User;
}