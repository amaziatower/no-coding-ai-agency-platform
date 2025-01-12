import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import * as HoverCard from '@radix-ui/react-hover-card';

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn('flex gap-5', className)}
    {...props}
    ref={ref}
  />
));
ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

const ButtonGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    icon: React.ReactNode;
    label: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, icon, label, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      '2 rounded-md border p-5 text-center focus:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.RadioGroupIndicator className="relative">
      <div className="relative">
        <div className="absolute -ml-6 -mt-[30px] ">
          <Icons.checkCircle className="text-primary" />
        </div>
      </div>
    </RadioGroupPrimitive.RadioGroupIndicator>

    <div className="flex flex-col justify-center">
      <div className="self-center">{icon}</div>
    </div>
  </RadioGroupPrimitive.Item>
));
ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const ButtonGroupItemColor = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    colorCode?: string; // Passing color code for background color
    label: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, colorCode, label, ...props }, ref) => (
  <HoverCard.Root>
    <HoverCard.Trigger asChild>
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className,
        )}
        {...props}
      >
        {props.checked && (
          <div className="absolute -ml-9 -mt-[58px] ">
            <Icons.checkCircle className="text-primary" />
          </div>
        )}
        {colorCode && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '15%',
              background: colorCode, // Use 'background' instead of 'backgroundColor'
            }}
          />
        )}
      </RadioGroupPrimitive.Item>
    </HoverCard.Trigger>
    <HoverCard.Content
      side="top" // Adjust this as needed
      align="center" // Adjust this as needed
      className="bg-background text-primary p-2 shadow-lg rounded-lg z-50"
    >
      <div className="text-sm">
        <div><strong>Label:</strong> {label}</div>
        <div><strong>Color Code:</strong> {colorCode}</div>
      </div>
    </HoverCard.Content>
  </HoverCard.Root>
));
ButtonGroupItemColor.displayName = RadioGroupPrimitive.Item.displayName;

export { ButtonGroup, ButtonGroupItem, ButtonGroupItemColor };
