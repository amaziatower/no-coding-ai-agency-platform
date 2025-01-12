"use client";

import Button from "@/components/supa-ui/Button";
import Card from "@/components/supa-ui/Card";
import { updateName } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      description="Please enter your full name, or a display name you are comfortable with."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">64 characters maximum</p>
          <Button
            form="nameForm"
            loading={isSubmitting}
            type="submit"
            variant="slim"
          >
            Update Name
          </Button>
        </div>
      }
      title="Your Name"
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            className="w-1/2 rounded-md bg-zinc-800 p-3"
            defaultValue={userName}
            maxLength={64}
            name="fullName"
            placeholder="Your name"
            type="text"
          />
        </form>
      </div>
    </Card>
  );
}
