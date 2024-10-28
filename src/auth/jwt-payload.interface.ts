import { UserRole } from "src/users/enums/user.role.enum";

export interface JwtPayload {
    id: number;
    role: UserRole
    // Add other fields if needed
  }
  