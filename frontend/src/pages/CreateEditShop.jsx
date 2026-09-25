import React, { useEffect, useState } from "react";
import { IoIosSkipBackward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { setMyShops } from "../redux/ownerSlice";
import { serverUrl } from "../config";

const CreateEditShop = () => {
  // If shopId exists → Edit
  // If shopId does not exist → Add
  const { shopId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get all shops from Redux
  const { myShops } = useSelector(
    (state) => state.owner
  );

  // Find the shop we want to edit
  const selectedShop = myShops.find(
    (shop) => shop._id === shopId
  );

  // User's current location
  const {
    currentCity,
    currentState,
    currentAddress,
  } = useSelector((state) => state.user);

  // ==================================
  // FORM STATES
  // ==================================

  const [name, setName] = useState(
    selectedShop?.name ?? ""
  );

  const [mobile, setMobile] = useState(
    selectedShop?.mobile ?? ""
  );

  const [address, setAddress] = useState(
    selectedShop?.address ?? ""
  );

  const [deliveryCharge, setDeliveryCharge] =
    useState(
      selectedShop?.deliveryCharge ?? 100
    );

  const [city, setCity] = useState(
    selectedShop?.city ?? ""
  );

  const [state, setState] = useState(
    selectedShop?.state ?? ""
  );

  // ==================================
  // SOCIAL / CONTACT STATES
  // ==================================

  const [facebookPage, setFacebookPage] = useState(
  selectedShop?.facebookPage ?? ""
);

  const [whatsapp, setWhatsapp] = useState(
    selectedShop?.whatsapp ?? ""
  );

  // ==================================
  // IMAGE STATES
  // ==================================

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(
      selectedShop?.image || null
    );

  // ==================================
  // HANDLE IMAGE
  // ==================================

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // ==================================
  // CLEAN IMAGE PREVIEW
  // ==================================

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

  // ==================================
  // AUTO GEO LOCATION FOR NEW SHOP
  // ==================================

  useEffect(() => {
    if (!shopId) {
      setCity(currentCity ?? "");
      setState(currentState ?? "");
      setAddress(currentAddress ?? "");
    }
  }, [
    shopId,
    currentCity,
    currentState,
    currentAddress,
  ]);

  // ==================================
  // LOAD SELECTED SHOP DATA
  // ==================================

  useEffect(() => {
    if (selectedShop) {
      setName(selectedShop.name ?? "");
      setMobile(selectedShop.mobile ?? "");
      setAddress(selectedShop.address ?? "");

      setDeliveryCharge(
        selectedShop.deliveryCharge ?? 100
      );

      setCity(selectedShop.city ?? "");
      setState(selectedShop.state ?? "");

      // Load Facebook
     setFacebookPage(
  selectedShop.facebookPage ?? ""
);

      // Load WhatsApp
      setWhatsapp(
        selectedShop.whatsapp ?? ""
      );

      setImagePreview(
        selectedShop.image || null
      );

      setImageFile(null);
    }
  }, [selectedShop]);

  // ==================================
  // SUBMIT
  // ==================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);

      formData.append(
        "deliveryCharge",
        deliveryCharge
      );

      // ==================================
      // FACEBOOK + WHATSAPP
      // ==================================

      formData.append("facebookPage", facebookPage);

      formData.append(
        "whatsapp",
        whatsapp
      );

      // ==================================
      // IMAGE
      // ==================================

      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      let result;

      // ==================================
      // ADD NEW SHOP
      // ==================================

      if (!shopId) {
        result = await axios.post(
          `${serverUrl}/api/shop/create`,
          formData,
          config
        );

        console.log(
          "NEW SHOP:",
          result.data
        );

        // Add new shop to existing shops
        dispatch(
          setMyShops([
            ...myShops,
            result.data.shop,
          ])
        );
      }

      // ==================================
      // EDIT EXISTING SHOP
      // ==================================

      else {
        result = await axios.put(
          `${serverUrl}/api/shop/update/${shopId}`,
          formData,
          config
        );

        console.log(
          "UPDATED SHOP:",
          result.data
        );

        // Replace old shop with updated shop
        const updatedShops =
          myShops.map((shop) =>
            shop._id === shopId
              ? result.data.shop
              : shop
          );

        dispatch(
          setMyShops(updatedShops)
        );
      }

      // Go back to owner dashboard
      navigate("/");

    } catch (error) {
      console.log(
        "ERROR =>",
        error.response?.data ||
          error.message
      );
    }
  };

  // ==================================
  // UI
  // ==================================

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
            {shopId
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
              placeholder="Shop Name"
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

          {/* FACEBOOK */}

          <div>
            <label className="block mb-1 text-sm font-medium">
              Facebook Page
            </label>

            <input
              type="url"
              value={facebookPage}
              onChange={(e) =>
             setFacebookPage(e.target.value)
                }
              placeholder="https://www.facebook.com/yourshop"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <p className="text-xs text-gray-500 mt-1">
              Enter your Facebook page or profile link.
            </p>
          </div>

          {/* WHATSAPP */}

          <div>
            <label className="block mb-1 text-sm font-medium">
              WhatsApp Number
            </label>

            <input
              type="tel"
              value={whatsapp}
              onChange={(e) =>
                setWhatsapp(
                  e.target.value.replace(
                    /[^0-9+]/g,
                    ""
                  )
                )
              }
              placeholder="03XXXXXXXXX"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <p className="text-xs text-gray-500 mt-1">
              Enter the WhatsApp number customers can contact.
            </p>
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
                    if (
                      imagePreview.startsWith(
                        "blob:"
                      )
                    ) {
                      URL.revokeObjectURL(
                        imagePreview
                      );
                    }

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
                setDeliveryCharge(
                  e.target.value
                )
              }
              placeholder="100"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <p className="text-xs text-gray-500 mt-1">
              Enter 0 for free delivery.
            </p>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white py-3 rounded-lg"
          >
            {shopId
              ? "Update Shop"
              : "Create Shop"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateEditShop;