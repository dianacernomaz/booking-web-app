export interface JwtPayload {
    userId?: string;
    email?: string;
    role?: string;
    fullName?: string;
    exp?: number;
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const data = JSON.parse(jsonPayload);
        
        // Map claims (URIs and custom keys) to clean property names
        const email = data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || data.email || data.sub;
        const role = data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || data.role;
        const userId = data["userId"] || data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const fullName = data["fullName"];
        
        return {
            userId,
            email,
            role,
            fullName,
            exp: data.exp
        };
    } catch {
        return null;
    }
}
