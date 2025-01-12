"use client";

import Button from "@/components/supa-ui/Button";
import Card from "@/components/supa-ui/Card";
import { updateEmail } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmailForm({
  userEmail,
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      description="Please enter the email address you want to use to login."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 text-white sm:pb-0">
            We will email you to verify the change.
          </p>
          <Button
            form="emailForm"
            loading={isSubmitting}
            type="submit"
            variant="slim"
          >
            Update Email
          </Button>
        </div>
      }
      title="Your Email"
    >
      <div className="mb-4 mt-8 text-xl font-semibold">
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            className="w-1/2 rounded-md bg-zinc-800 p-3 text-sm text-zinc-300"
            defaultValue={userEmail ?? ""}
            maxLength={64}
            name="newEmail"
            placeholder="Your email"
            type="text"
          />
        </form>
      </div>
    </Card>
  );
}
