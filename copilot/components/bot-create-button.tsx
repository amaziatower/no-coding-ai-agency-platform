"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from 'react';
import { Icons } from "@/components/icons";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface BotCreateButtonProps extends ButtonProps {}

export function BotCreateButton({
  className,
  variant,
  ...props
}: BotCreateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = useState(null);

  const onClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create bot');
      }

      // Handle successful bot creation here
      // Maybe refresh bot list or show a success message
      console.log('Bot created successfully:', data);
      toast.success("Bot created");

      console.log("Data", data);
      // Navigate to the specific bot's settings page using the returned ID
      const botId = data[0].id;  // Ensure you are accessing the ID correctly based on your API response structure
      console.log("Bot iD", botId);
      router.push(`/bot/${botId}/customization`);

    } catch (err) {
      console.error('Error creating bot:', err);
      setError(err.message);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // async function onClick() {
  //   // This forces a cache invalidation.
  //   router.refresh();

  //   router.push(`/bot/settings`);
  // }

  return (
    <button
      className={cn(
        buttonVariants({ variant: "secondary" }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className,
      )}
      disabled={isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 size-4" />
      )}
      New bot
    </button>
  );
}
