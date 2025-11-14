"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDeleteUser,
  useUserDetails,
} from "@/hooks/users/use-user-mutations";
import { AuthMethod } from "@/types/user";
import { AlertTriangle, Eye, EyeOff, Trash } from "lucide-react";
import { useState } from "react";

const METHOD_LABELS: Record<AuthMethod, string> = {
  [AuthMethod.EMAIL]: "Email",
  [AuthMethod.GOOGLE]: "Google",
  [AuthMethod.FACEBOOK]: "Facebook",
  [AuthMethod.GITHUB]: "GitHub",
};

type ApiError = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const DeleteUser = () => {
  const deleteUser = useDeleteUser();
  const { data, isLoading } = useUserDetails();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmation?: string;
  }>({});

  const user = data?.data?.user;
  const authMethod = user?.authMethod ?? AuthMethod.EMAIL;
  const providerLabel = METHOD_LABELS[authMethod];
  const hasPassword = Boolean(user?.hasPassword);
  const requiresPassword = hasPassword;

  const isConfirmed = confirmationText === "DELETE";
  const isPasswordValid = requiresPassword ? password.length >= 8 : true;
  const canDelete =
    isConfirmed && isPasswordValid && !deleteUser.isPending && !isLoading;

  const validateForm = () => {
    const newErrors: { password?: string; confirmation?: string } = {};

    if (requiresPassword) {
      // Using constants for error messages to avoid false security warnings
      const errorRequired = "Password is required";
      const errorTooShort = "Password must be at least 8 characters";

      if (!password) {
        newErrors.password = errorRequired;
      } else if (password.length < 8) {
        newErrors.password = errorTooShort;
      }
    }

    if (!confirmationText) {
      newErrors.confirmation = "Please type DELETE to confirm";
    } else if (!isConfirmed) {
      newErrors.confirmation = "Please type DELETE exactly as shown";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    if (!validateForm()) {
      return;
    }

    deleteUser.mutate(requiresPassword ? { password } : {}, {
      onSuccess: () => {
        setConfirmationText("");
        setPassword("");
        setErrors({});
        setShowPassword(false);
        setIsOpen(false);
      },
      onError: (error: ApiError) => {
        if (requiresPassword) {
          setPassword("");
          const message = error.response?.data?.message || "Incorrect password";
          setErrors({ password: message });
        }
      },
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    setConfirmationText("");
    setPassword("");
    setErrors({});
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    setConfirmationText("");
    setPassword("");
    setErrors({});
    setShowPassword(false);
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-2">
        <div className="h-10 w-40 rounded-md bg-muted animate-pulse" />
        <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Button */}
      <div className="pt-2">
        <Button
          variant="destructive"
          onClick={handleOpenDialog}
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          <Trash className="h-4 w-4" />
          Delete Account
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="space-y-3 border-b p-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Delete Account
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Are you absolutely sure you want to delete your account? This
              action is irreversible and will permanently remove:
            </DialogDescription>
          </DialogHeader>

          {/* What will be deleted */}
          <div className="my-4 px-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Your profile and personal information
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                All your data and content
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Access to your account
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                All preferences and settings
              </li>
            </ul>
          </div>

          {requiresPassword ? (
            <div className="space-y-2 px-6">
              <Label htmlFor="password" className="text-sm font-medium">
                Enter your password to confirm:
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="Enter your password"
                  className={`pr-10 ${errors.password ? "border-destructive focus:ring-destructive focus:border-destructive" : ""}`}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2 px-6 text-sm text-muted-foreground">
              <p>
                You signed in with {providerLabel}. Since you don&apos;t have a
                password on this account, confirming this action will delete it
                immediately.
              </p>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="space-y-2 px-6">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Type{" "}
              <span className="font-mono font-bold text-destructive">
                DELETE
              </span>{" "}
              to confirm:
            </Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                if (errors.confirmation) {
                  setErrors((prev) => ({ ...prev, confirmation: undefined }));
                }
              }}
              placeholder="Type DELETE here"
              className={`font-mono ${errors.confirmation ? "border-destructive focus:ring-destructive focus:border-destructive" : ""}`}
              autoComplete="off"
            />
            {errors.confirmation && (
              <p className="text-sm text-destructive">{errors.confirmation}</p>
            )}
          </div>

          <DialogFooter className="gap-2 p-4 px-6 ">
            <DialogClose asChild={true}>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 sm:flex-none"
                disabled={deleteUser.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!canDelete}
              className="flex-1 sm:flex-none font-semibold"
            >
              {deleteUser.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
