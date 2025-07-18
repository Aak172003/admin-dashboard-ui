export type Credentials = {
    email: string;
    password: string;
};


export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    tenant: TenantData | null;
};

export type CreateUser = {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: string;
    tenantId: number;
}

export type CreateTenant = {
    name: string;
    address: string;
}

export type TenantData = {
    id: number;
    name: string;
    address: string;
};


export type FieldData = {
    name: string;
    value?: string;
}



