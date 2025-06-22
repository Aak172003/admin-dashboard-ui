import { ENDPOINT_LOGIN, ENDPOINT_LOGOUT, ENDPOINT_REFRESH_TOKEN, ENDPOINT_SELF } from "../text";
import type { Credentials } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) => api.post(ENDPOINT_LOGIN, credentials)

export const self = () => api.get(ENDPOINT_SELF)

export const logout = () => api.post(ENDPOINT_LOGOUT)

export const refreshToken = () => api.post(ENDPOINT_REFRESH_TOKEN)