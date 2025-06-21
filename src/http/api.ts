import { ENDPOINT_LOGIN, ENDPOINT_SELF } from "../text";
import type { Credentials } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) => api.post(ENDPOINT_LOGIN, credentials)

export const self = () => api.get(ENDPOINT_SELF)