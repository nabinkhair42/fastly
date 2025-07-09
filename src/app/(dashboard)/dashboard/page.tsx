'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserDetails } from '@/hooks/useUserMutations';
import { Calendar, Mail, Settings, User } from 'lucide-react';

export default function UsersPage() {
  const { data: userDetails, isLoading } = useUserDetails();

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium ">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {userDetails?.data.user.firstName}{' '}
                      {userDetails?.data.user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium ">Username</p>
                    <p className="text-sm text-muted-foreground">
                      @{userDetails?.data.user.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium ">Email</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {userDetails?.data.user.email}
                    </p>
                  </div>
                  {userDetails?.data.user.bio && (
                    <div>
                      <p className="text-sm font-medium ">Bio</p>
                      <p className="text-sm text-muted-foreground">
                        {userDetails.data.user.bio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Account Stats
              </CardTitle>
              <CardDescription>Your account overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm ">Status</span>
                  <span className="text-sm font-medium text-green-600">
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm ">Email Verified</span>
                  <span className="text-sm font-medium text-green-600">
                    ✓ Yes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm ">Username Changes</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {userDetails?.data.user.username ? '1/1' : '0/1'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Change Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">
                Welcome to Your Dashboard!
              </h2>
              <p className="text-gray-600 mb-4">
                Your account setup is complete. You can now access all features
                of the platform.
              </p>
              <div className="flex justify-center space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
