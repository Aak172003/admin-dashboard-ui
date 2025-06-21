import type { User } from "../store";

export const usePermission = () => {
    const allowedRoles = ["admin", "manager"];


    const _hasPermission = (user: User | null) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    }


    return {
        isAllowed: _hasPermission
    }
}