# M2: Secure Access - Authentication System

This document describes the authentication system implementation for the Physio Center Management System.

## Overview

The M2 Secure Access milestone implements a complete authentication and authorization system using JWT (JSON Web Tokens) for stateless authentication and bcrypt for secure password hashing. The system supports four user roles: OWNER, THERAPIST, SECRETARY, and PATIENT.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ AuthProvider  │  │ ApiClient     │  │ ProtectedRoute          │  │
│  │ Context      │  │ (fetch wrapper│  │ (Route wrappers)        │  │
│  └──────────────┘  │  with auth)   │  └────────────────────────┘  │
│        │              └──────────────┘              │              │
│        │                                      │              │
│  ┌─────▼─────┐                          ┌─────▼─────┐          │
│  │ useAuth   │                          │ Login     │          │
│  │ useHasRole│                          │ Register  │          │
│  └───────────┘                          └───────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Express)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Auth Routes  │  │ Auth Middle- │  │ Auth Service           │  │
│  │ /api/auth/*  │  │ ware         │  │ (Business logic)       │  │
│  └──────────────┘  └──────────────┘  └────────────────────────┘  │
│        │                    │                    │                  │
│        ▼                    ▼                    ▼                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    JWT & Password Utilities                      │  │
│  │  - JWT token generation/verification                           │  │
│  │  - Bcrypt password hashing/verification                       │  │
│  │  - Config validation                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL (Neon)                             │  │
│  │  - Users table with password hashes                            │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Method | Endpoint             | Description          | Authentication | Role  |
| ------ | -------------------- | -------------------- | -------------- | ----- |
| POST   | `/api/auth/register` | Register new user    | None           | None  |
| POST   | `/api/auth/login`    | Login user           | None           | None  |
| POST   | `/api/auth/logout`   | Logout user          | Optional       | None  |
| POST   | `/api/auth/refresh`  | Refresh access token | None           | None  |
| GET    | `/api/auth/me`       | Get current user     | Required       | None  |
| GET    | `/api/auth/users`    | Get all users        | Required       | OWNER |

## Request/Response Types

### RegisterInput

```typescript
{
  name: string;
  email: string;
  password: string; // Minimum 8 characters
  role: UserRole; // "OWNER" | "THERAPIST" | "SECRETARY" | "PATIENT"
  phone?: string;
}
```

### LoginInput

```typescript
{
  email: string;
  password: string;
}
```

### AuthResponse

```typescript
{
  user: User;
  tokens: AuthTokens;
}
```

### AuthTokens

```typescript
{
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Seconds until access token expires
}
```

### MeResponse

```typescript
{
  user: User;
}
```

### RefreshTokenInput

```typescript
{
  refreshToken: string;
}
```

## Backend Implementation

### Configuration

Environment variables (defined in `.env.example`):

```bash
# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
JWT_ACCESS_EXPIRES_IN="15m"  # 15 minutes
JWT_REFRESH_EXPIRES_IN="7d"   # 7 days

# Password hashing
BCRYPT_ROUNDS=12
```

**Security Requirements:**

- `JWT_SECRET` must be at least 32 characters
- `JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN` use duration format: `15m`, `1h`, `1d`, `7d`
- `BCRYPT_ROUNDS` defaults to 12 (recommended for production)

### Files

| File                                  | Purpose                               |
| ------------------------------------- | ------------------------------------- |
| `backend/src/lib/config.ts`           | Environment validation with zod       |
| `backend/src/lib/jwt.ts`              | JWT token generation and verification |
| `backend/src/lib/password.ts`         | Bcrypt password hashing               |
| `backend/src/lib/prisma.ts`           | Prisma client singleton               |
| `backend/src/middleware/auth.ts`      | Authentication middleware             |
| `backend/src/services/auth.ts`        | Auth business logic                   |
| `backend/src/routes/auth.ts`          | Auth API routes                       |
| `backend/src/types/jsonwebtoken.d.ts` | JWT type declarations                 |
| `backend/src/types/express.d.ts`      | Express type declarations             |
| `backend/tests/auth.test.ts`          | Integration tests                     |

### JWT Utilities

```typescript
// Generate tokens
const tokens = generateTokens({ userId, role, email });

// Verify token (throws on invalid)
const payload = verifyToken(token);

// Decode token without verification
const payload = decodeToken(token);

// Check if token is expired
const isExpired = isTokenExpired(token);
```

### Password Utilities

```typescript
// Hash password
const hash = await hashPassword(password);

// Verify password against hash
const isValid = await verifyPassword(password, hash);
```

### Authentication Middleware

```typescript
// Require authentication
router.get("/protected", authenticate, (req, res) => {
  // req.user is available
});

// Optional authentication
router.get("/public", optionalAuth, (req, res) => {
  // req.user may be available
});

// Role-based authorization
router.get("/admin", authenticate, authorize(["OWNER"]), (req, res) => {
  // Only OWNER can access
});

// Convenience middleware
router.get("/owner", authenticate, requireOwner, handler);
router.get("/therapist", authenticate, requireTherapist, handler);
router.get("/secretary", authenticate, requireSecretary, handler);
router.get("/patient", authenticate, requirePatient, handler);
```

### Auth Service

```typescript
// Register user
await registerUser(input: RegisterInput): Promise<AuthResponse>

// Login user
await loginUser(input: LoginInput): Promise<AuthResponse>

// Refresh tokens
await refreshTokens(input: RefreshTokenInput): Promise<AuthResponse>

// Get user by ID
await getUserById(userId: string): Promise<User>

// Get all users
await getAllUsers(): Promise<User[]>

// Delete user
await deleteUser(userId: string): Promise<User>
```

## Frontend Implementation

### Auth Context

The `AuthProvider` component provides authentication state to the entire application.

```tsx
// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{/* Your routes */}</Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Hooks

```typescript
// Get full auth state and methods
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  login,
  register,
  logout,
  refresh,
  clearError,
} = useAuth();

// Get current user
const user = useCurrentUser();

// Check authentication status
const isAuthenticated = useIsAuthenticated();

// Check user role
const isOwner = useHasRole("OWNER");
const isStaff = useHasRole(["OWNER", "THERAPIST", "SECRETARY"]);
```

### API Client

The `apiClient` provides typed methods for all API endpoints with automatic token management.

```typescript
import { apiClient } from "./lib/api-client";

// Register
const response = await apiClient.register({ name, email, password, role });

// Login
const response = await apiClient.login({ email, password });

// Logout
const result = await apiClient.logout();

// Refresh token
const response = await apiClient.refreshToken({ refreshToken });

// Get current user
const me = await apiClient.me();

// Token management
apiClient.setTokens({ accessToken, refreshToken });
apiClient.clearTokens();
const token = apiClient.getAccessToken();
```

### Protected Routes

```tsx
import { ProtectedRoute, PublicRoute, RoleProtectedRoute,
         OwnerRoute, TherapistRoute, SecretaryRoute, PatientRoute } from "./components/ProtectedRoute";

// Protected route - requires authentication
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Public route - redirects authenticated users
<Route path="/login" element={
  <PublicRoute>
    <Login />
  </PublicRoute>
} />

// Role-based protection
<Route path="/admin" element={
  <RoleProtectedRoute roles="OWNER">
    <AdminPanel />
  </RoleProtectedRoute>
} />

// Convenience wrappers
<Route path="/settings" element={
  <OwnerRoute>
    <Settings />
  </OwnerRoute>
} />
```

### Pages

| File                              | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `frontend/src/pages/Login.tsx`    | Login form with email/password        |
| `frontend/src/pages/Register.tsx` | Registration form with role selection |

## Testing

### Backend Tests

Run auth integration tests:

```bash
# Run all backend tests
pnpm --filter @physio/backend test

# Run specific test file
pnpm --filter @physio/backend test backend/tests/auth.test.ts
```

### Test Coverage

The `backend/tests/auth.test.ts` file includes tests for:

- User registration (success, validation errors, duplicate email)
- User login (success, invalid credentials, validation errors)
- Token refresh (success, invalid token)
- Logout
- Protected routes (authentication required, role-based access)
- Health check

## Security Considerations

### JWT Security

1. **Secret Key**: Must be at least 32 characters and kept secret
2. **Token Expiration**: Access tokens expire quickly (15 minutes default)
3. **Refresh Tokens**: Long-lived tokens (7 days default) for obtaining new access tokens
4. **Stateless**: No server-side session storage; tokens contain all necessary information

### Password Security

1. **Hashing**: Passwords are hashed with bcrypt before storage
2. **Salting**: Bcrypt automatically handles salting
3. **Rounds**: 12 rounds by default (configurable via `BCRYPT_ROUNDS`)
4. **Never Stored Plain**: Plain text passwords are never stored in the database

### Token Storage

1. **Client-side**: Access and refresh tokens are stored in browser localStorage
2. **Automatic Injection**: The `apiClient` automatically adds the Authorization header
3. **Clear on Logout**: Tokens are cleared from localStorage on logout

### Role-Based Access Control

The system enforces role-based access at multiple levels:

1. **Route Level**: Middleware prevents access to routes requiring specific roles
2. **Component Level**: ProtectedRoute wrappers prevent rendering of unauthorized components
3. **UI Level**: UI elements can be conditionally rendered based on role

## Deployment

### Environment Setup

1. Generate a strong JWT secret:

   ```bash
   openssl rand -base64 32
   ```

2. Add to your `.env` file:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/physio?schema=public"
   JWT_SECRET="your-generated-secret-here"
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   BCRYPT_ROUNDS=12
   PORT=3000
   VITE_API_URL="http://localhost:3000"
   ```

### Running Locally

1. Start the backend:

   ```bash
   cd backend
   pnpm dev
   ```

2. Start the frontend:

   ```bash
   cd frontend
   pnpm dev
   ```

3. Access the application at `http://localhost:5173`

## Troubleshooting

### Common Issues

1. **JWT_SECRET too short**: Ensure your JWT secret is at least 32 characters
2. **Invalid token**: Verify the token is being sent in the Authorization header as `Bearer <token>`
3. **Password validation fails**: Ensure passwords are at least 8 characters
4. **Email validation fails**: Ensure email addresses are valid format
5. **CORS issues**: Ensure your frontend and backend URLs match the CORS configuration

### Debugging

Enable debug logging for auth-related operations:

```bash
# Set DEBUG environment variable
DEBUG=auth,password,jwt pnpm dev
```

## Future Enhancements

1. **Token Blacklisting**: Add ability to revoke refresh tokens
2. **Password Reset**: Implement password reset flow with email verification
3. **Two-Factor Authentication**: Add 2FA support for sensitive operations
4. **Session Management**: Track active sessions and allow remote logout
5. **Rate Limiting**: Add rate limiting to auth endpoints
6. **IP Tracking**: Track login attempts by IP for security alerts
