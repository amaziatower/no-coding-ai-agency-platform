"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { MainNavItem } from "../types";

const footerItemsEn = {
  contactus: "Contact Us",
  privacypolicy: "Privacy Policy",
  termsconditions: "Terms & Conditions",
};

const footerItemsFr = {
  contactus: "Contactez-nous",
  privacypolicy: "Politique de confidentialité",
  termsconditions: "Termes et conditions",
};

export function SiteFooter({ lang }: { lang: string }) {
  const footerItems = lang === "en" ? footerItemsEn : footerItemsFr;
  const { setTheme, theme } = useTheme();

  const imageSource =
    theme === "dark" ? "/images/ollabot-dark.png" : "/images/ollabot-light.png";

  return (
    <footer className="mt-5 flex w-full flex-col items-center justify-between border-t bg-violetColor p-4 text-center sm:flex-row sm:py-8 sm:text-start lg:px-40">
      <div className="mx-2 w-full justify-between text-lg font-bold text-footer sm:mx-4 sm:text-xl">
        <Link
          className="mx-2 font-bold text-footer hover:underline sm:mx-4"
          href="/"
          target="_blank"
        >
          {footerItems.contactus}
        </Link>{" "}
        <Link
          className="mx-2 font-bold text-footer hover:underline sm:mx-4"
          href="/"
          target="_blank"
        >
          {footerItems.privacypolicy}
        </Link>
        <Link
          className="mx-2 font-bold text-footer hover:underline sm:mx-4"
          href="/"
          target="_blank"
        >
          {footerItems.termsconditions}
        </Link>
      </div>
      <div className="flex size-auto items-center justify-center space-x-4 pb-4 sm:pb-0">
        <Link aria-label="Twitter" className="group" href="/" target="_blank">
          <Image
            alt="Logo"
            className="size-full"
            height={68} // Replace 100 with the desired height value
            src={imageSource}
            width={125} // Replace 100 with the desired width value
          />
        </Link>
      </div>
    </footer>
  );
}
