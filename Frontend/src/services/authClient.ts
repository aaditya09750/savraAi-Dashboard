import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_BASE_URL?.split('/api/v1')[0] ?? "http://localhost:5000",
    plugins: [usernameClient()],
    fetchOptions: {
        // Ensure credentials are included for cross-site cookie support
        credentials: "include",
    }
});
