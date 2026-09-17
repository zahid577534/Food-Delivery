
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("CURRENT USER:", result.data.user);

        dispatch(setUser(result.data.user));

      } catch (error) {
        console.error(
          "Error fetching current user:",
          error.response?.data || error.message
        );
      }
    };

    fetchCurrentUser();
  }, [dispatch, serverUrl]);

  return null;
}

export default useGetCurrentUser;

