
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyShops } from "../redux/ownerSlice";

function useGetMyShop() {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.user
  );

  const serverUrl =
    import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchShops = async () => {

      // Only owners need shops
      if (!user || user.role !== "owner") {
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      try {

        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            withCredentials: true,
          }
        );

        console.log(
          "MY SHOPS FROM SERVER:",
          result.data
        );

        if (result.data.success) {

          dispatch(
            setMyShops(
              result.data.shops || []
            )
          );

        }

      } catch (error) {

        console.error(
          "Error fetching my shops:",
          error.response?.data ||
            error.message
        );

      }
    };

    fetchShops();

  }, [
    dispatch,
    serverUrl,
    user,
  ]);

  return null;
}

export default useGetMyShop;

