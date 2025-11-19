"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  trigger,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [randomPos, setRandomPos] = React.useState<string>("");

  React.useEffect(() => {
    const positions = ["top", "bottom", "left", "right", "center"];
    setRandomPos(positions[Math.floor(Math.random() * positions.length)]);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className={className}>
          {(title || subtitle) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  // For this design, we'll always use full screen for mobile

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className={cn("fixed inset-0 z-50 flex flex-col bg-white", className)}>
        <DrawerHeader className="text-left px-4 pt-6 pb-2">
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {subtitle && <DrawerDescription>{subtitle}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-24">{children}</div>
        <DrawerFooter className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-center z-50">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full max-w-xs">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
