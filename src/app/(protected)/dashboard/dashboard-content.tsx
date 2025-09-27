'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserDetails } from '@/hooks/users/useUserMutations';
import {
  ArrowUpRight,
  Calendar,
  Clock3,
  Mail,
  MapPin,
  Palette,
  Settings2,
  ShieldCheck,
  Sparkles,
  Type,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
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

const socialIconMap: Record<string, ReactNode> = {
  website: <FaGlobe className="h-4 w-4 text-muted-foreground" />,
  twitter: <FaXTwitter className="h-4 w-4 text-muted-foreground" />,
  github: <FaGithub className="h-4 w-4 text-muted-foreground" />,
  linkedin: <FaLinkedin className="h-4 w-4 text-muted-foreground" />,
  instagram: <FaInstagram className="h-4 w-4 text-muted-foreground" />,
  facebook: <FaFacebook className="h-4 w-4 text-muted-foreground" />,
  youtube: <FaYoutube className="h-4 w-4 text-muted-foreground" />,
  tiktok: <FaTiktok className="h-4 w-4 text-muted-foreground" />,
  discord: <FaDiscord className="h-4 w-4 text-muted-foreground" />,
};

const formatLocation = (
  location?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
  } | null
) => {
  if (!location) return '';
  return [location.city, location.state, location.country]
    .filter(Boolean)
    .join(', ');
};

const titleCase = (value?: string | null) => {
  if (!value) return 'Not set';
  return value
    .split(' ')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export default function DashboardContent() {
  const { data: userDetails, isLoading } = useUserDetails();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-8 p-6 lg:p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-16 rounded-3xl bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="h-28 rounded-2xl bg-muted" />
            <div className="h-28 rounded-2xl bg-muted" />
            <div className="h-28 rounded-2xl bg-muted" />
          </div>
          <div className="h-32 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  const user = userDetails?.data?.user;

  if (!user) {
    return (
      <div className="space-y-6 p-6 lg:p-10 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">
          We could not load your profile details just yet. Try refreshing or
          update your information.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.refresh()}>Refresh</Button>
          <Button
            variant="outline"
            onClick={() => router.push('/edit-profile')}
          >
            Edit profile
          </Button>
        </div>
      </div>
    );
  }

  const fullName =
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unnamed User';
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` || 'UU';
  const locationDisplay = formatLocation(user.location);
  const authMethod = titleCase(user.authMethod ?? 'email');
  const themePreference = titleCase(user.preferences?.theme) ?? 'System';
  const fontPreference = titleCase(user.preferences?.font) ?? 'Sans';
  const canChangeUsername = !user.hasChangedUsername;

  const quickActions = [
    {
      label: 'Edit profile',
      description: 'Update your name, avatar and bio',
      href: '/edit-profile',
    },
    {
      label: 'Account security',
      description: 'Manage email, password and sessions',
      href: '/account',
    },
    {
      label: 'Change password',
      description: 'Rotate your credentials securely',
      href: '/change-password',
    },
  ];

  return (
    <div className="space-y-10 p-6 lg:p-10">
      {/* Hero */}
      <section className="p-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-primary/40 shadow-2xl">
              <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
              <AvatarFallback className="text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {fullName}
                </h1>
                <Badge variant="outline" className="gap-1 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {authMethod}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />@{user.username}
                </span>
                {locationDisplay && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {locationDisplay}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="max-w-sm text-muted-foreground">
              A modern snapshot of your account perfect for showcasing the
              starter kit&apos;s profile and preference flows.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="gap-1 text-xs">
                {canChangeUsername
                  ? 'Username change available'
                  : 'Username locked'}
              </Badge>
              {user.dob && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(user.dob).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        {/* Profile Overview */}
        <section className="space-y-6 p-6">
          <header className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Profile overview</h2>
              <p className="text-sm text-muted-foreground">
                Essential details and preferences at a glance.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => router.push('/edit-profile')}
            >
              Edit profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border bg-card/40 p-4">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="text-sm font-medium break-all">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border bg-card/40 p-4">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Username
                </p>
                <p className="text-sm font-medium">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border bg-card/40 p-4">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Theme preference
                </p>
                <p className="text-sm font-medium">{themePreference}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border bg-card/40 p-4">
              <Type className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Typeface
                </p>
                <p className="text-sm font-medium">{fontPreference}</p>
              </div>
            </div>
          </div>

          {(user.bio || locationDisplay) && (
            <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
              {user.bio && (
                <div className="rounded-2xl border bg-card/40 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Bio
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {user.bio}
                  </p>
                </div>
              )}
              {locationDisplay && (
                <div className="rounded-2xl border bg-card/40 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Location
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {locationDisplay}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Account Snapshot */}
        <aside className="space-y-6 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account snapshot</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border bg-card/40 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Sign-in method
                    </p>
                    <p className="font-medium">{authMethod}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Secure
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border bg-card/40 p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Username status
                    </p>
                    <p className="font-medium">
                      {canChangeUsername
                        ? 'One change remaining'
                        : 'Already changed'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {canChangeUsername ? 'Available' : 'Locked'}
                </Badge>
              </div>
              {user.dob && (
                <div className="flex items-center justify-between rounded-2xl border bg-card/40 p-4">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Date of birth
                      </p>
                      <p className="font-medium">
                        {new Date(user.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick actions
            </h3>
            <div className="space-y-2">
              {quickActions.map(action => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="h-auto w-full justify-between gap-3 rounded-2xl border-dashed py-3 text-left"
                  onClick={() => router.push(action.href)}
                >
                  <span className="flex flex-col">
                    <span className="font-medium text-sm">{action.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card/40 p-5">
            <div className="flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Preference summary
              </h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                • Theme is set to{' '}
                <span className="font-medium text-foreground">
                  {themePreference}
                </span>
              </li>
              <li>
                • Typeface set to{' '}
                <span className="font-medium text-foreground">
                  {fontPreference}
                </span>
              </li>
              <li>
                •{' '}
                {canChangeUsername
                  ? 'Username change still available.'
                  : 'Username change already used.'}
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Social & Reachability */}
      {(user.socialAccounts?.length ?? 0) > 0 && (
        <section className="space-y-4 rounded-3xl border bg-background/60 p-6 shadow-sm backdrop-blur">
          <header className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Social presence</h2>
              <p className="text-sm text-muted-foreground">
                Connected platforms and URLs for quick outreach.
              </p>
            </div>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {user.socialAccounts!.map((account, index) => (
              <a
                key={`${account.provider}-${index}`}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border bg-card/40 p-4 transition hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background">
                    {socialIconMap[account.provider ?? 'website'] ?? (
                      <FaGlobe className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {account.provider
                        ? account.provider.charAt(0).toUpperCase() +
                          account.provider.slice(1)
                        : 'Website'}
                    </p>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground/80">
                      {account.url}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
