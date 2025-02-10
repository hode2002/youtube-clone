export type JwtPayload = {
    email: string;
    role: string;
    userId: string;
    iat?: number;
    exp?: number;
};
