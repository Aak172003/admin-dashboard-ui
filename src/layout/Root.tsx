import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";

const getSelf = async () => {
  const { data } = await self();
  console.log("response :::::::::::: ", data);
  return data;
};

const Root = () => {
  const { setUser } = useAuthStore();
  // Now we are using refetch to fetch the self data after login
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
  });

  useEffect(() => {
    console.log("data :::::::::::: ", data);
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default Root;
