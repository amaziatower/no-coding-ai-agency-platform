"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useRef, ButtonHTMLAttributes } from "react";
import { mergeRefs } from "react-merge-refs";

import LoadingDots from "@/components/supa-ui/LoadingDots";

import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "slim" | "flat";
  active?: boolean;
  width?: number;
  loading?: boolean;
  Component?: React.ComponentType;
}

const Button = forwardRef<HTMLButtonElement, Props>((props, buttonRef) => {
  const {
    Component = "button",
    active,
    children,
    className,
    disabled = false,
    loading = false,
    style = {},
    variant = "flat",
    width,
    ...rest
  } = props;
  const ref = useRef(null);
  const rootClassName = cn(
    styles.root,
    {
      [styles.slim]: variant === "slim",
      [styles.loading]: loading,
      [styles.disabled]: disabled,
    },
    className,
  );
  return (
    <Component
      ref={mergeRefs([ref, buttonRef])}
      aria-pressed={active}
      className={rootClassName}
      data-variant={variant}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {children}
      {loading && (
        <i className="m-0 flex pl-2">
          <LoadingDots />
        </i>
      )}
    </Component>
  );
});
Button.displayName = "Button";

export default Button;
