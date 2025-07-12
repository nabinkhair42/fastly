'use client';

import { UploadAvatar } from '@/app/(dashboard)/settings/components/upload-avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProfileForm } from '@/hooks/useProfileForm';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckCircle,
  Loader2,
  Trash2,
  XCircle,
} from 'lucide-react';

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
    return <div className="px-6">Loading...</div>;
  }

  return (
    <div className="px-6 flex flex-col gap-4">
      <UploadAvatar />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                  This is your first name. It will be displayed on your profile.
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
                  This is your last name. It will be displayed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      onChange={e => {
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
                      You can change your username only once. Choose carefully.
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
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
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
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown"
                      formatters={{
                        formatMonthDropdown: date =>
                          date.toLocaleString('default', { month: 'long' }),
                        formatYearDropdown: date =>
                          date.getFullYear().toString(),
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth helps us personalize your experience. You
                  can quickly select year and month using the dropdowns.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="space-y-4">
            <div>
              <FormLabel>Social Accounts</FormLabel>
              <FormDescription>
                Add links to your website, blog, or social media profiles.
              </FormDescription>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`socialAccounts.${index}.provider`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="github">GitHub</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="discord">Discord</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`socialAccounts.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="flex-[2]">
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ provider: '', url: '' })}
            >
              Add Social Account
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitDisabled}>
            {isUpdating ? 'Updating...' : 'Update profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
