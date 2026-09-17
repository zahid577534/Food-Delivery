import React, { useEffect, useState } from "react";
import { IoIosSkipBackward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import { serverUrl } from "../config";
const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { myShopData } = useSelector(
    (state) => state.owner
  );

  const {
    currentCity,
    currentState,
    currentAddress,
  } = useSelector((state) => state.user);

  const [name, setName] = useState(
    myShopData?.name ?? ""
  );

  const [mobile, setMobile] = useState(
    myShopData?.mobile ?? ""
  );

  const [address, setAddress] = useState(
    myShopData?.address ?? ""
  );
  const [deliveryCharge, setDeliveryCharge] = useState(
  myShopData?.deliveryCharge ?? 100
);

  const [city, setCity] = useState(
    myShopData?.city ?? ""
  );

  const [state, setState] = useState(
    myShopData?.state ?? ""
  );

  // IMAGE STATES (FIXED)
  const [imageFile, setImageFile] =
    useState(null);
  const [imagePreview, setImagePreview] =
    useState(myShopData?.image || null);

  // HANDLE IMAGE
  const handleImage = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (imagePreview) {
    URL.revokeObjectURL(imagePreview);
  }

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
};
useEffect(() => {
  return () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }
  };
}, [imagePreview]);
  // AUTO GEO LOCATION SYNC
  useEffect(() => {
    if (!myShopData) {
      setCity(currentCity ?? "");
      setState(currentState ?? "");
      setAddress(currentAddress ?? "");
    }
  }, [
    currentCity,
    currentState,
    currentAddress,
    myShopData,
  ]);

  // SUBMIT
  
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    console.log("TOKEN =>", token);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("address", address);
    formData.append("deliveryCharge", deliveryCharge);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    console.log("CONFIG =>", config);

    const result = await axios.post(
      `${serverUrl}/api/shop/create-edit`,
      formData,
      config
    );

    console.log(result.data);

    dispatch(setMyShopData(result.data.shop));

    navigate("/");

  } catch (error) {
    console.log(
      "ERROR =>",
      error.response?.data
    );
  }
};

  return (
    <div className="flex justify-center items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative">

      {/* BACK BUTTON */}
      <div
        className="absolute top-5 left-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoIosSkipBackward
          size={28}
          className="text-[#ff4d2d]"
        />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">

          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            {myShopData
              ? "Edit Shop"
              : "Add Shop"}
          </h1>

        </div>

        {/* FORM */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Mobile Number
            </label>

            <input
              type="tel"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(
                    /[^0-9+]/g,
                    ""
                  )
                )
              }
              placeholder="03XXXXXXXXX"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Shop Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full px-4 py-2 border rounded-lg"
            />

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="mt-2 text-sm text-red-500"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* CITY + STATE */}
          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="City"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
              placeholder="State"
              className="w-full px-4 py-2 border rounded-lg"
            />

          </div>

          {/* ADDRESS */}
          <div>
            <input
              type="text"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white py-3 rounded-lg"
          >
            Save
          </button>
          {/* DELIVERY CHARGE */}
<div>
  <label className="block mb-1 text-sm font-medium">
    Delivery Charge (Rs.)
  </label>

  <input
    type="number"
    min="0"
    value={deliveryCharge}
    onChange={(e) =>
      setDeliveryCharge(e.target.value)
    }
    placeholder="100"
    className="w-full px-4 py-2 border rounded-lg"
  />

  <p className="text-xs text-gray-500 mt-1">
    Enter 0 for free delivery.
  </p>
</div>

        </form>

      </div>
    </div>
  );
};

export default CreateEditShop;