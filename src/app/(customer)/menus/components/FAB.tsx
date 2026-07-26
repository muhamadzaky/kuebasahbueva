"use client";

import { buildWhatsAppLink } from "@/utils/generateWAOrder";
import { RiWhatsappLine } from "@remixicon/react";
import { FloatButton } from "antd";

const FAB = () => {
  return (
    <FloatButton
      icon={<RiWhatsappLine size={32} />}
      href={buildWhatsAppLink("Halo, saya ingin memesan kue")}
      className="bg-green-500! hover:bg-green-600! size-16!"
    />
  );
};

export default FAB;
