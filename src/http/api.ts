import { ENDPOINT_LOGIN, ENDPOINT_LOGOUT, ENDPOINT_REFRESH_TOKEN, ENDPOINT_SELF, ENDPOINT_TENANTS, ENDPOINT_USERS } from "../text";
import type { CreateTenant, CreateUser, Credentials } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) => api.post(ENDPOINT_LOGIN, credentials)

export const self = () => api.get(ENDPOINT_SELF)

export const logout = () => api.post(ENDPOINT_LOGOUT)

export const refreshToken = () => api.post(ENDPOINT_REFRESH_TOKEN)

export const getUsers = (queryString: string) => api.get(`${ENDPOINT_USERS}?${queryString}`)

export const getTenants = (queryString: string) => api.get(`${ENDPOINT_TENANTS}?${queryString}`)


export const createUser = (user: CreateUser) => api.post(ENDPOINT_USERS, user)

export const createTenant = (tenant: CreateTenant) => api.post(ENDPOINT_TENANTS, tenant)