"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react"; // import the Star icon
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { ButtonProps, buttonVariants, Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

interface CreateBotProps extends ButtonProps {}

export function CreateBot({ className, variant, ...props }: CreateBotProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Define the form using useForm
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });
  const {
    formState: { errors },
  } = form;
  const { isSubmitting, isValid } = form.formState;
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
    console.log("File handles: ", event.target.files);
  };
  async function onSubmit() {
    // This forces a cache invalidation.
    router.refresh();

    router.push(`/dashboard/create`);
  }

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Add a file here</h1>
        <p className="text-sm text-slate-600">
          Upload a file to generate a course
        </p>
        <Form {...form}>
          {isLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <form
              className="mt-8 space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="par exemple. « Développement Web avancé »"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Que allez-vous enseigner dans ce cours ?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="file">Téléchargement de fichier *</Label>
                <Input
                  className="w-full"
                  id="file"
                  onChange={handleFileChange}
                  type="file"
                />
              </div>
              <div className="flex items-center gap-x-2">
                <Link href="/dashboard/teacher/courses">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  variant="default"
                >
                  Générer avec l&apos;IA
                  <Star className="glitter-star ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
}
