import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import { useAuthStore } from "../store";

export const useLogout = () => {
    const { logout: logoutFromStore } = useAuthStore();

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ["logout"],
        mutationFn: logout,
        onSuccess: () => {
            // After logout success we are calling the logoutFromStore function to logout the user from the store
            console.log("logout successfully");
            logoutFromStore();
            return;
        },
    });

    return { logoutMutate };
};
