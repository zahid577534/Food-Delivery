import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const serverUrl = "http://localhost:8000";

const handleSignOut = async () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  try {
    await axios.post(
      `${serverUrl}/api/auth/signout`,
      {},
      { withCredentials: true }
    );

    dispatch(logout());

    navigate("/signin");
  } catch (error) {
    console.log("Logout error:", error.message);

    // fallback cleanup
    dispatch(logout());
    navigate("/signin");
  }
};