const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: string | null;
  is_active: boolean;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}

export async function register(payload: {
  first_name: string;
  last_name: string;
  age?: number | null;
  gender?: string | null;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}