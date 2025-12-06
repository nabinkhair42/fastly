"use client";

import DashboardSkeleton from "@/app/(protected)/components/dashboard-skeleton";
import { UploadAvatar } from "@/app/(protected)/components/upload-avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useProfileForm } from "@/hooks/users/use-profile-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Loader2, XCircle } from "lucide-react";

import { LocationSection } from "./location-section";
import { SocialAccountsSection } from "./social-accounts-section";

export function ProfileForm() {
  const {
    form,
    fields,
    append,
    remove,
    handleSubmit,
    isLoading,
    isSubmitDisabled,
    isUpdating,
    usernameValue,
    usernameAvailable,
    checkingUsername,
    handleUsernameChange,
    hasChangedUsername,
    user,
  } = useProfileForm();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="w-full max-w-md">
        <h3 className="font-medium">Profile Settings</h3>
        <p className="text-muted-foreground text-sm">
          Update your personal information and manage your profile details.
        </p>
      </div>
      <div className="space-y-6 w-full">
        <UploadAvatar />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Name Fields */}
            <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your first name. It will be displayed on your
                      profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your last name. It will be displayed on your
                      profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Username and DOB Fields */}
            <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="shadcn"
                          {...field}
                          disabled={hasChangedUsername}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUsernameChange(e);
                          }}
                        />
                        {!hasChangedUsername &&
                          usernameValue &&
                          usernameValue !== user?.username && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {checkingUsername ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : usernameAvailable === true ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : usernameAvailable === false ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : null}
                            </div>
                          )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {hasChangedUsername ? (
                        <span className="text-muted-foreground">
                          Username can only be changed once. You have already
                          updated your username.
                        </span>
                      ) : (
                        <span className="text-warning">
                          You can change your username only once. Choose
                          carefully.
                        </span>
                      )}
                    </FormDescription>
                    {!hasChangedUsername &&
                      usernameValue &&
                      usernameValue !== user?.username && (
                        <div className="text-sm">
                          {checkingUsername ? (
                            <span className="text-muted-foreground">
                              Checking availability...
                            </span>
                          ) : usernameAvailable === true ? (
                            <span className="text-green-600">
                              ✓ Username is available
                            </span>
                          ) : usernameAvailable === false ? (
                            <span className="text-red-600">
                              ✗ Username is already taken
                            </span>
                          ) : null}
                        </div>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild={true}>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                          formatters={{
                            formatMonthDropdown: (date) =>
                              date.toLocaleString("default", { month: "long" }),
                            formatYearDropdown: (date) =>
                              date.getFullYear().toString(),
                          }}
                          initialFocus={true}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth helps us personalize your experience.
                      You can quickly select year and month using the dropdowns.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bio Field */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your bio. It will be displayed on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Section */}
            <LocationSection form={form} />

            {/* Social Accounts Section */}
            <SocialAccountsSection
              form={form}
              fields={fields}
              append={append}
              remove={remove}
            />

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              loading={isUpdating}
              loadingText="Updating"
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
