import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
} from "../redux/userSlice";
import axios from "axios";

const useGetCity = () => {
  const dispatch = useDispatch();

  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } =
            position.coords;

          const result = await axios.get(
            "https://api.geoapify.com/v1/geocode/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
                apiKey,
              },
            }
          );

          const props =
            result.data?.features?.[0]?.properties;

          if (!props) return;

          const city =
            props.city ||
            props.town ||
            props.village ||
            props.county ||
            "";

          const stateName =
            props.state || "";

          // Full address
         const address =
  [
    props.housenumber, // House No
    props.street, // Street Name / Street No
    props.suburb || // Colony
      props.neighbourhood ||
      props.quarter ||
      props.district,
    props.city ||
      props.town ||
      props.village,
    props.state,
    props.postcode,
  ]
    .filter(Boolean)
    .join(", ") ||
  props.formatted ||
  "";

          dispatch(setCurrentCity(city));
          dispatch(setCurrentState(stateName));
          dispatch(setCurrentAddress(address));

          console.log("City:", city);
          console.log("State:", stateName);
          console.log("Address:", address);

        } catch (error) {
          console.error(
            "Geo API error:",
            error
          );
        }
      },
      (error) => {
        console.error(
          "Location error:",
          error
        );
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [user, dispatch, apiKey]);

  return null;
};

export default useGetCity;