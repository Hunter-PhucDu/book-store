import { UserRole } from "@/types/user";

declare module "next-auth" {
  /**
   * Extending the built-in User interface
   */
  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extending the built-in JWT interface
   */
  interface JWT {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth" {
  /**
   * Extending the built-in Session interface
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }
}
