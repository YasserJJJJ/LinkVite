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

export type EventPayload = {
  title: string;
  description?: string | null;
  cover_image?: string | null;
  start_datetime: string;
  location_type: "online" | "physical";
  location_details?: string | null;
  capacity?: number | null;
  is_paid: boolean;
  organizer_name: string;
  organizer_email: string;
  status: "draft" | "published";
};

export type EventItem = {
  id: number;
  title: string;
  description: string | null;
  cover_image: string | null;
  start_datetime: string;
  location_type: "online" | "physical";
  location_details: string | null;
  capacity: number | null;
  is_paid: boolean;
  organizer_name: string;
  organizer_email: string;
  status: "draft" | "published";
  owner_id: number;
  created_at: string;
  updated_at: string;
};

export async function createEvent(token: string, payload: EventPayload): Promise<EventItem> {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getMyEvents(token: string): Promise<{ items: EventItem[] }> {
  const response = await fetch(`${API_BASE_URL}/api/events/mine`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}