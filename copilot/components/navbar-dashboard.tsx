"use client";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { navbarConfig, navbarConfigFr } from "@/config/navbar-dashboard";
import { cn } from "@/lib/utils";
import { Icons } from "components/icons";
import { MobileNav } from "components/mobile-nav";
import { ModeToggle } from "components/mode-toggle";
import { siteConfig } from "config/site";
import { MainNavItem } from "../types";
import LocaleSwitcher from "./LocaleSwitcher";

const logoimg = "/images/ollabot.png";

interface MainNavProps {
  items?: Array<MainNavItem>;
  children?: React.ReactNode;
}

export function DashboardNavbar(
  { lang }: { lang: string },
  {
    children,
    items = lang === "en" ? navbarConfig.mainNav : navbarConfigFr.mainNav,
  }: MainNavProps,
) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const { setTheme, theme } = useTheme();
  return (
    <div className="mr-5 flex w-full items-center justify-between gap-6 md:gap-10">
      <div className="flex items-center">
        <Link
          className="hidden size-full items-start space-x-2 md:flex"
          href="/"
        >
          <Image
            alt="Logo"
            className="size-1/2"
            height={137} // Replace 100 with the desired height value
            src="/images/ollabot.png"
            width={250} // Replace 100 with the desired width value
          />
        </Link>
      </div>

      <ModeToggle />
    </div>
  );
}
