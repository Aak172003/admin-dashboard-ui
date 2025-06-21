import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";
import { AxiosError } from "axios";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const Root = () => {
  const { setUser } = useAuthStore();
  // Now we are using refetch to fetch the self data after login
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: (failureCount: number, error) => {
      //  if error type 401 return false means no retry
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      //  Otherwise retry the request 3 times if it fails
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default Root;
