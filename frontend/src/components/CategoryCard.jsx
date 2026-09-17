import React from "react";

function CategoryCard({ data }) {
  return (
    <div
      className="w-[120px] md:w-[180px]
      rounded-2xl border-2 border-[#ff4d2d]
      shrink-0 overflow-hidden bg-white
      shadow-xl shadow-gray-200
      hover:shadow-2xl transition-shadow
      cursor-pointer"
    >
      {/* Image */}
      <div className="w-full h-[120px] md:h-[140px] overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover
          transition-transform duration-300
          hover:scale-110"
        />
      </div>

      {/* Category Name */}
      <div className="p-3 text-center bg-white">
        <p className="font-semibold text-gray-800">
          {data.name}
        </p>
      </div>
    </div>
  );
}

export default CategoryCard;