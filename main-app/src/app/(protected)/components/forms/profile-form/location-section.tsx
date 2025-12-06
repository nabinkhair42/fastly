"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, RotateCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface LocationSectionProps {
  form: UseFormReturn<any>;
}

export function LocationSection({ form }: LocationSectionProps) {
  const handleClearLocation = () => {
    form.resetField("location", {
      defaultValue: {
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      keepDirty: false,
      keepTouched: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-muted-foreground" /> Location
          </h4>
          <p className="text-sm text-muted-foreground">
            Share where you&apos;re based. Leave any field blank to keep it
            hidden.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
          onClick={handleClearLocation}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear fields
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Region</FormLabel>
              <FormControl>
                <Input placeholder="California" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP / Postal code</FormLabel>
              <FormControl>
                <Input placeholder="94103" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
