"use client";

import Link from "next/link";
import { useState } from "react";
import {
  pricingModelsEn,
  pricingModelsFR,
  description,
  buttonText,
} from "@/config/pricing";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";

export const metadata = {
  title: "Pricing",
};

export function PricingPage({
  isAuthenticated,
  lang,
}: {
  lang: string;
  isAuthenticated: boolean;
}) {
  const [isMonthly, setIsMonthly] = useState(true);
  const handlePricingToggle = (monthly: boolean) => {
    setIsMonthly(monthly);
  };

  const pricingModels = lang === "en" ? pricingModelsEn : pricingModelsFR;
  const descriptionText = lang === "en" ? description.en : description.fr;
  const buttonTextText = lang === "en" ? buttonText.en : buttonText.fr;

  // The button variant changes based on the `isMonthly` state
  const monthlyButtonVariant = isMonthly ? "secondary" : "pricingGhost";
  const yearlyButtonVariant = isMonthly ? "pricingGhost" : "secondary";

  return (
    <div className="md:max-w-9/10 container flex flex-col gap-6 bg-pricingBackground py-2 md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="text-center font-heading text-3xl leading-[1.1] text-white sm:text-3xl md:text-4xl">
          {descriptionText.pricing}
        </h2>
      </div>
      <div className="mx-auto flex size-auto flex-row gap-2 rounded-lg border-2 border-white/30 bg-blackColor p-2">
        <button
          aria-pressed={isMonthly}
          className={cn(
            buttonVariants({ variant: monthlyButtonVariant, size: "lg" }),
          )}
          onClick={() => handlePricingToggle(true)}
        >
          {buttonTextText.monthly}
        </button>
        <button
          aria-pressed={!isMonthly}
          className={cn(
            buttonVariants({ variant: yearlyButtonVariant, size: "lg" }),
          )}
          onClick={() => handlePricingToggle(false)}
        >
          {buttonTextText.yearly}
        </button>
      </div>
      <div className="grid size-auto min-h-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 ">
        {pricingModels.map((model, index) => (
          <div
            key={index}
            className="flex size-auto min-h-0 flex-col gap-1 rounded-lg border bg-blackColor p-6 text-start"
          >
            <h3 className="min-h-0 text-center  text-xl font-bold text-violetColor sm:text-2xl">
              {model.title}
            </h3>
            <h4 className="min-h-0 text-center  text-3xl font-bold text-greenColor">
              {isMonthly ? model.monthlyPrice : model.yearlyPrice}
              <span className="text-lg"> / mo</span>
            </h4>
            <ul className="mb-4 flex min-h-0 flex-col gap-3 text-sm font-bold text-grayColor">
              {model.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-start justify-start"
                >
                  <Icons.check
                    className="mr-2 size-6  min-h-0 shrink-0 "
                    style={{ color: "rgb(95, 207, 192)" }}
                  />{" "}
                  <p className="text-md min-h-0 font-bold text-grayColor ">
                    {" "}
                    {feature}{" "}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
              )}
              href={
                isAuthenticated
                  ? isMonthly
                    ? model.monthlyLink
                    : model.yearlyLink
                  : "/signin"
              }
            >
              {buttonTextText.getstarted}
            </Link>
          </div>
        ))}
      </div>
      <div className="mx-auto mb-10 flex w-full max-w-[58rem] flex-col rounded-lg border-4 border-violetColor bg-blackColor  p-8">
        <h3 className="text-md mb-2 font-bold text-white sm:text-xl">
          {descriptionText.title}
        </h3>
        <p className=" text-sm leading-normal text-white sm:leading-7">
          <strong>{descriptionText.description}</strong>
        </p>
      </div>
    </div>
  );
}
