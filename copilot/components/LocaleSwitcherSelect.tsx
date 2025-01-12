"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import React, { ChangeEvent, ReactNode, useTransition } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "components/ui/select";
import { useRouter, usePathname } from "../navigation";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(value: string) {
    startTransition(() => {
      router.replace({ pathname }, { locale: value });
    });
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {React.Children.map(children, (child) => {
          // Check if child is a valid React element before accessing props
          if (React.isValidElement(child)) {
            return (
              <SelectItem key={child.props.value} value={child.props.value}>
                {child.props.children}
              </SelectItem>
            );
          }
          return null;
        })}
      </SelectContent>
    </Select>
  );
}
