import { Wrench } from "lucide-react";
import React from "react";

const Border = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#2563EB]" />
        <div className="rounded-full border border-[#FFB020] bg-[#0B1020] p-3">
          <Wrench className="text-[#FFB020]" size={22} />
        </div>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#FFB020]" />
      </div>
    </div>
  );
};

export default Border;
