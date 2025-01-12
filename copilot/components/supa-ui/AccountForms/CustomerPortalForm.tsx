"use client";

import Button from "@/components/supa-ui/Button";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { createStripePortal } from "@/utils/stripe/server";
import Link from "next/link";
import Card from "@/components/supa-ui/Card";
import { Tables } from "@/types_db";

type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;
type Product = Tables<"products">;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : "You are not currently subscribed to any plan."
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 text-white sm:pb-0">
            Manage your subscription on Stripe.
          </p>
          <Button
            loading={isSubmitting}
            onClick={handleStripePortalRequest}
            variant="slim"
          >
            Open customer portal
          </Button>
        </div>
      }
      title="Your Plan"
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : (
          <Link href="/#pricing">Choose your plan</Link>
        )}
      </div>
    </Card>
  );
}
