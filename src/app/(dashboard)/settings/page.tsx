'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUserDetails } from '@/hooks/useUserMutations';
import {
  CalendarDays,
  Edit,
  ExternalLink,
  Mail,
  MapPin,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
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

const SettingsPage = () => {
  const { data: userDetails, isLoading } = useUserDetails();

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!userDetails?.data?.user) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">No user data found</p>
      </div>
    );
  }

  const user = userDetails.data.user;
  const avatarFallback =
    (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-md">
            <Settings className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-sm text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/settings/edit-profile">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || ''} />
                <AvatarFallback className="text-lg">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>

            {user.bio && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              </>
            )}

            {user.location && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {[
                      user.location.city,
                      user.location.state,
                      user.location.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Username Status</span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    user.hasChangedUsername
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {user.hasChangedUsername ? 'Changed' : 'Can Change'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Theme</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {user.preferences?.theme || 'System'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Font</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {user.preferences?.font || 'Sans'}
                </span>
              </div>

              {user.dob && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Date of Birth
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.dob).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        {user.socialAccounts && user.socialAccounts.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Social Links
              </CardTitle>
              <CardDescription>
                Your connected social accounts and websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {user.socialAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    {account.provider === 'website' && (
                      <FaGlobe className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'twitter' && (
                      <FaXTwitter className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'github' && (
                      <FaGithub className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'linkedin' && (
                      <FaLinkedin className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'instagram' && (
                      <FaInstagram className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'facebook' && (
                      <FaFacebook className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'youtube' && (
                      <FaYoutube className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'tiktok' && (
                      <FaTiktok className="h-4 w-4 text-muted-foreground" />
                    )}
                    {account.provider === 'discord' && (
                      <FaDiscord className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {account.provider
                          ? account.provider.charAt(0).toUpperCase() +
                            account.provider.slice(1)
                          : 'Website'}
                      </p>
                      <a
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate block"
                      >
                        {account.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
