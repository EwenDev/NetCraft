export interface User {
    email: string;
    username: string;
    role: Role;
};

export enum Role {
    USER = "user",
    ADMIN = "admin",
}