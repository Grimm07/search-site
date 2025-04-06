// src/types/auth.ts

export interface AuthResponse {
    token: string;
    // Add any additional fields returned by your auth service
}

export interface AuthPayload {
    username: string;
    password: string;
}
