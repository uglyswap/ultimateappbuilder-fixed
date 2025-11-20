interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    role: string;
    subscriptionTier: string;
    createdAt: Date;
}
declare class AuthService {
    private readonly saltRounds;
    private readonly accessTokenExpiry;
    private readonly refreshTokenExpiry;
    /**
     * Register a new user
     */
    register(email: string, password: string, name?: string): Promise<{
        user: UserResponse;
        tokens: AuthTokens;
    }>;
    /**
     * Login user
     */
    login(email: string, password: string): Promise<{
        user: UserResponse;
        tokens: AuthTokens;
    }>;
    /**
     * Refresh access token
     */
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    /**
     * Verify access token
     */
    verifyAccessToken(token: string): TokenPayload;
    /**
     * Get user by ID
     */
    getUserById(userId: string): Promise<UserResponse | null>;
    /**
     * Change password
     */
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    /**
     * Generate access and refresh tokens
     */
    private generateTokens;
    /**
     * Format user for response
     */
    private formatUser;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth-service.d.ts.map