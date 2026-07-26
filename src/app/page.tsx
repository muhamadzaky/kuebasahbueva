"use client";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { buildWhatsAppLink } from "@/utils/generateWAOrder";
import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Home() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push("/menus");
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans bg-primary-white dark:bg-primary-black h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6">
        <Image
          src="/logo.png"
          alt="Kue Basah Bu Eva logo"
          width={360}
          height={360}
          priority
        />
        {/* 
        <Link
          href={buildWhatsAppLink("")}
          className="mt-8 text-2xl font-bold underline! text-primary-black! hover:text-primary-black! dark:text-primary-white! dark:hover:text-primary-white!"
        >
          {formatPhoneNumber(process.env.NEXT_PUBLIC_WA_NO)}
        </Link>

        <Link
          href="https://gofood.co.id/bandung/restaurant/kue-basah-bu-eva-tata-surya-4c5aac71-ea6b-4b5f-91f5-e2546d97c133"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-primary-black! hover:text-primary-black! dark:text-primary-white! dark:hover:text-primary-white!"
        >
          <Card classNames={{ body: "flex items-center gap-2" }}>
            Order On
            <Image
              src="https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/f9546f29-23c3-4384-adf9-03bb59a89136_gofood-logo.png?auto=format"
              alt="GoFood logo"
              width={130}
              height={30}
            />
          </Card>
        </Link> */}
      </main>
    </div>
  );
}
