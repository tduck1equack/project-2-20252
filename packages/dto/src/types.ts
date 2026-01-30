export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
    ACCOUNTANT = 'ACCOUNTANT',
    CUSTOMER = 'CUSTOMER'
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'ACCOUNTANT' | 'CUSTOMER';

export interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    tenantId: string | null;
}

export interface TokenPayload {
    sub: string;
    email: string;
    name?: string | null;
    role: string;
    tenantId: string | null;
    jti: string;
}

export interface TokenPair {
    accessToken: string;
    expiresIn: number;
}
