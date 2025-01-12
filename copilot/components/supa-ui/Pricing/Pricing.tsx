"use client";

import {Button} from "@/components/ui/button";
import LogoCloud from "@/components/supa-ui/LogoCloud";
import type { Tables } from "@/types_db";
import { getStripe } from "@/utils/stripe/client";
import { checkoutWithStripe } from "@/utils/stripe/server";
import { getErrorRedirect } from "@/utils/helpers";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Icons } from "@/components/icons";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;

interface LocaleFeatures {
    monthlyPrice: string;
    yearlyPrice: string;
    features: Array<string>;
}

interface Features {
    locale: {
        en: LocaleFeatures;
        fr: LocaleFeatures;
    };
}

interface ProductWithPrices extends Product {
    prices: Array<Price>;
    features: Features; // Updated to use the new Features interface
}

interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: Array<ProductWithPrices>;
  subscription: SubscriptionWithProduct | null;
  lang: string
}

type BillingInterval = "lifetime" | "year" | "month";

export default function Pricing({ products, subscription, user, lang }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push("/signin/signup");
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath ?? "",
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath ?? "",
          "An unknown error occurred.",
          "Please try again later or contact a system administrator.",
        ),
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  const getFeaturesByLang = (features: Features, lang: string) => {
    return lang === 'fr' ? features.locale.fr.features : features.locale.en.features;
  };

  const getCurrencyLocale = (lang: string) => {
    if (lang === "fr") {
      return { currency: "EUR", locale: "fr-FR" };
    } else {
      return { currency: "USD", locale: "en-US" };
    }
  };

  if (products.length === 0) {
    return (
      <section className="md:max-w-9/10 container flex flex-col gap-6 bg-pricingBackground py-2 md:py-12 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col" />
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{" "}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <section className="container w-full flex flex-col gap-6 bg-pricingBackground py-2 md:py-12 lg:py-24">
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col">
            <h2 className="text-center font-heading text-3xl leading-[1.1] text-white sm:text-3xl md:text-4xl">
              {lang === "fr" ? "Tarifs" : "Pricing"}
            </h2>
            {/* <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-200 sm:text-center sm:text-2xl">
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </p> */}
            <div className="relative mt-6 flex self-center rounded-lg border border-white bg-zinc-900 p-0.5 sm:mt-8">
              {intervals.includes("month") && (
                <button 
                  className={`${
                    billingInterval === "month"
                      ? "relative w-1/2 border-zinc-800 bg-secondary text-white shadow-sm "
                      : "relative ml-0.5 w-1/2 border border-transparent text-zinc-400"
                  } m-1 whitespace-nowrap h-11 rounded-md px-8 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
                  onClick={() => setBillingInterval("month")}
                  type="button"
                >
                  {lang === "fr" ? "Mensuel" : "Monthly"}
                </button>
              )}
              {intervals.includes("year") && (
                <button
                  className={`${
                    billingInterval === "year"
                      ? "relative w-1/2 border-zinc-800 bg-secondary text-white shadow-sm"
                      : "relative ml-0.5 w-1/2 border border-transparent text-zinc-400"
                  } m-1 whitespace-nowrap h-11 rounded-md px-8 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
                  onClick={() => setBillingInterval("year")}
                  type="button"
                >
                  {lang === "fr" ? "Annuel" : "Yearly"}
                </button>
              )}
            </div>
          </div>
          <div className="grid size-auto min-h-0 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              console.log("Product", product)
              const productLocaleFeatures = product.features.locale;  // Renamed to 'productLocaleFeatures' to avoid conflict
              const currencySettings = getCurrencyLocale(lang);  // Renamed and now holds both currency and locale settings
              const price = product?.prices?.find((price) => price.interval === billingInterval);

              if (!price) return null;

              const priceString = new Intl.NumberFormat(currencySettings.locale, {
                style: "currency",
                currency: currencySettings.currency,
                minimumFractionDigits: 0,
              }).format((price?.unit_amount || 0) / 100);
              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex flex-col divide-y divide-zinc-600 rounded-lg bg-zinc-900 shadow-sm border border-white mt-6",
                    {
                      "border border-pink-500": subscription
                        ? product.name === subscription?.prices?.products?.name
                        : product.name === "Freelancer",
                    },
                    "flex-1", // This makes the flex item grow to fill the space
                    "basis-1/4", // Assuming you want each card to take up roughly a third of the container's width
                    "w-full", // Adjusting width responsively
                  )}
                >
                  <div className="p-6">
                    <h2 className="text-2xl text-center text-secondary font-bold leading-6">
                      {product.name}
                    </h2>
                    {/* <p className="mt-4 text-zinc-300">{product.description}</p> */}
                    <p className="mt-4 min-h-0 text-center  font-bold text-greenColor">
                      <span className="white text-4xl font-extrabold">
                        {priceString}
                      </span>
                      <span className="text-base font-medium">
                        /{billingInterval}
                      </span>
                    </p>
                  <div className="mt-4">
                    {/* <h3 className="text-lg p-1 text-grayColor">Features:</h3> */}
                    <ul className="mb-4 flex min-h-0 flex-col gap-3 text-sm font-bold text-grayColor">
                      {productLocaleFeatures[lang].features.map((feature, idx) => (
                        <li key={idx} className="flex items-start justify-start">
                          <Icons.check className="mr-2 size-6 min-h-0 shrink-0" style={{ color: "rgb(95, 207, 192)" }} />
                          <p className="text-md min-h-0 font-bold text-grayColor ">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      onClick={() => handleStripeCheckout(price)}
                      type="button"
                    >
                      {subscription ? "Manage" : "Subscribe"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mx-auto mb-10 flex w-full max-w-[58rem] flex-col rounded-lg border-4 border-violetColor bg-blackColor  p-8">
          <h3 className="text-md mb-2 font-bold text-white sm:text-xl">
            {lang === "fr" ? 
            "Besoin de quelque chose de spécifique ?" 
            : "Need something specific?"
            }
          </h3>
          <p className=" text-sm leading-normal text-white sm:leading-7">
            <strong>
              {lang === "fr" ? 
              "Nous comprenons que chaque entreprise est unique. C'est pourquoi nous proposons des forfaits personnalisés, garantissant que vous ne payez que pour les fonctionnalités dont vous avez besoin. Prêt pour une solution logicielle personnalisée ?" 
              : "We understand that every business is unique. That's why we provide personalized plans, ensuring you pay only for the features you require. Ready for a custom software solution?"
              }
            </strong>
          </p>
      </div>
      </section>
    );
  }
}
