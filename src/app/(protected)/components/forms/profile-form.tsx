'use client';

import { UploadAvatar } from '@/app/(protected)/components/upload-avatar';
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
import { Textarea } from '@/components/ui/textarea';
import { useProfileForm } from '@/hooks/users/useProfileForm';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  Loader2,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

// Social platform constants
const SOCIAL_PLATFORMS = {
  website: {
    label: 'Website',
    icon: FaGlobe,
    placeholder: 'https://yourwebsite.com',
  },
  github: {
    label: 'GitHub',
    icon: FaGithub,
    placeholder: 'https://github.com/username',
  },
  twitter: {
    label: 'Twitter',
    icon: FaXTwitter,
    placeholder: 'https://twitter.com/username',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: FaLinkedin,
    placeholder: 'https://linkedin.com/in/username',
  },
  instagram: {
    label: 'Instagram',
    icon: FaInstagram,
    placeholder: 'https://instagram.com/username',
  },
  facebook: {
    label: 'Facebook',
    icon: FaFacebook,
    placeholder: 'https://facebook.com/username',
  },
  youtube: {
    label: 'YouTube',
    icon: FaYoutube,
    placeholder: 'https://youtube.com/@username',
  },
  tiktok: {
    label: 'TikTok',
    icon: FaTiktok,
    placeholder: 'https://tiktok.com/@username',
  },
  discord: {
    label: 'Discord',
    icon: FaDiscord,
    placeholder: 'https://discord.gg/server',
  },
  other: { label: 'Other', icon: FaGlobe, placeholder: 'https://example.com' },
} as const;

// Integrated Social Input Component
function SocialInput({
  provider,
  url,
  onProviderChange,
  onUrlChange,
  placeholder = 'https://example.com',
}: {
  provider: string;
  url: string;
  onProviderChange: (provider: string) => void;
  onUrlChange: (url: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPlatform =
    SOCIAL_PLATFORMS[provider as keyof typeof SOCIAL_PLATFORMS];
  const Icon = selectedPlatform?.icon || FaGlobe;
  const dynamicPlaceholder = selectedPlatform?.placeholder || placeholder;

  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={url}
          onChange={e => onUrlChange(e.target.value)}
          placeholder={dynamicPlaceholder}
          className="pl-12 pr-10"
        />

        {/* Platform Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center hover:bg-muted rounded-sm p-1 transition-colors"
        >
          <ChevronDown
            className={cn(
              'h-3 w-3 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md">
          <div className="grid grid-cols-5 gap-1 p-2">
            {Object.entries(SOCIAL_PLATFORMS).map(
              ([key, { icon: PlatformIcon, label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onProviderChange(key);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-sm hover:bg-accent transition-colors',
                    provider === key && 'bg-accent'
                  )}
                  title={label}
                >
                  <PlatformIcon className="h-4 w-4" />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

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
                      Your date of birth helps us personalize your experience.
                      You can quickly select year and month using the dropdowns.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  <div className="flex-1">
                    <SocialInput
                      provider={
                        form.watch(`socialAccounts.${index}.provider`) ||
                        'website'
                      }
                      url={form.watch(`socialAccounts.${index}.url`) || ''}
                      onProviderChange={provider => {
                        form.setValue(
                          `socialAccounts.${index}.provider`,
                          provider
                        );
                      }}
                      onUrlChange={url => {
                        form.setValue(`socialAccounts.${index}.url`, url);
                      }}
                    />
                  </div>
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
                onClick={() => append({ provider: 'website', url: '' })}
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
    </div>
  );
}
