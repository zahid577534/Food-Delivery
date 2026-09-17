import React from "react";
import { useSelector } from "react-redux";
import DeliveryBoy from "../components/DeliveryBoy";
import OwnerDashboard from "../components/OwnerDashboard";
import UserDashboard from "../components/UserDashboard";

function Home() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full min-h-screen pt-[100px] bg-[#fff9f6]">
      <div className="flex flex-col items-center">
        {user?.role === "owner" && <OwnerDashboard />}

        {user?.role === "user" && <UserDashboard />}

        {user?.role === "delivery-boy" && <DeliveryBoy />}
      </div>
    </div>
  );
}

export default Home;