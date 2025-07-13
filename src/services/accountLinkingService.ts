import { hashPassword } from '@/helpers/hashPassword';
import { generateTokenPair } from '@/helpers/jwtToken';
import { UserAuthModel } from '@/models/users';
import { AuthIdentity, AuthProvider, UserAuth } from '@/types/user';
import { OAuthUser } from './oauthService';

export interface AccountLinkingResult {
  user: UserAuth;
  isNewUser: boolean;
  linkedProvider?: AuthProvider;
}

/**
 * Auth0 Standard: Handle OAuth sign-in with automatic account linking
 * Links accounts with same email automatically
 */
export async function handleOAuthSignIn(
  provider: AuthProvider,
  oauthUser: OAuthUser
): Promise<AccountLinkingResult> {
  const existingUser = await UserAuthModel.findOne({ email: oauthUser.email });

  if (existingUser) {
    // Check if this provider is already linked
    const hasProvider = existingUser.identities.some(
      (identity: AuthIdentity) => identity.provider === provider
    );

    if (!hasProvider) {
      // Auth0 Standard: Automatically link new provider to existing account
      existingUser.identities.push({
        provider,
        providerId: oauthUser.id,
        providerEmail: oauthUser.email,
        isVerified: true, // OAuth emails are pre-verified
        isPrimary: existingUser.identities.length === 0, // First identity is primary
        linkedAt: new Date(),
      });

      // Update user info if not set (OAuth might have better data)
      if (!existingUser.firstName && oauthUser.firstName) {
        existingUser.firstName = oauthUser.firstName;
      }
      if (!existingUser.lastName && oauthUser.lastName) {
        existingUser.lastName = oauthUser.lastName;
      }

      await existingUser.save();
    }

    // Update last login info
    existingUser.lastLoginAt = new Date();
    existingUser.lastLoginProvider = provider;
    existingUser.isVerified = true; // OAuth users are verified
    await existingUser.save();

    return {
      user: existingUser,
      isNewUser: false,
      linkedProvider: !hasProvider ? provider : undefined,
    };
  } else {
    // Create new user with OAuth identity
    const newUser = await UserAuthModel.create({
      email: oauthUser.email,
      firstName: oauthUser.firstName || oauthUser.name.split(' ')[0] || '',
      lastName:
        oauthUser.lastName ||
        oauthUser.name.split(' ').slice(1).join(' ') ||
        '',
      password: null, // OAuth users don't have passwords initially
      hasPassword: false,
      isVerified: true, // OAuth emails are pre-verified
      authMethod: provider, // Set primary auth method
      identities: [
        {
          provider,
          providerId: oauthUser.id,
          providerEmail: oauthUser.email,
          isVerified: true,
          isPrimary: true, // First identity is always primary
          linkedAt: new Date(),
        },
      ],
      lastLoginAt: new Date(),
      lastLoginProvider: provider,
    });

    return {
      user: newUser,
      isNewUser: true,
    };
  }
}

/**
 * Handle email/password sign-up with potential OAuth account linking
 */
export async function handleEmailSignUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AccountLinkingResult> {
  const existingUser = await UserAuthModel.findOne({ email });

  if (existingUser) {
    // Check if user already has email identity
    const hasEmailIdentity = existingUser.identities.some(
      (identity: AuthIdentity) => identity.provider === 'email'
    );

    if (hasEmailIdentity) {
      throw new Error('Account with this email already exists');
    }

    // Auth0 Standard: Link email/password to existing OAuth account
    const hashedPassword = await hashPassword(password);

    existingUser.password = hashedPassword;
    existingUser.hasPassword = true;
    existingUser.identities.push({
      provider: 'email',
      providerId: email,
      providerEmail: email,
      isVerified: false, // Email needs verification
      isPrimary: existingUser.identities.length === 0,
      linkedAt: new Date(),
    });

    // Update name if not set
    if (!existingUser.firstName) existingUser.firstName = firstName;
    if (!existingUser.lastName) existingUser.lastName = lastName;

    await existingUser.save();

    return {
      user: existingUser,
      isNewUser: false,
      linkedProvider: 'email',
    };
  } else {
    // Create new email/password account
    const hashedPassword = await hashPassword(password);

    const newUser = await UserAuthModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      hasPassword: true,
      isVerified: false, // Email accounts need verification
      authMethod: 'email',
      identities: [
        {
          provider: 'email',
          providerId: email,
          providerEmail: email,
          isVerified: false,
          isPrimary: true,
          linkedAt: new Date(),
        },
      ],
      lastLoginProvider: 'email',
    });

    return {
      user: newUser,
      isNewUser: true,
    };
  }
}

/**
 * Allow OAuth user to set password for email login
 */
export async function setPasswordForOAuthUser(
  userId: string,
  password: string
): Promise<void> {
  const user = await UserAuthModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.hasPassword) {
    throw new Error('User already has a password');
  }

  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  user.hasPassword = true;

  // Add email identity if not exists
  const hasEmailIdentity = user.identities.some(
    (identity: AuthIdentity) => identity.provider === 'email'
  );

  if (!hasEmailIdentity) {
    user.identities.push({
      provider: 'email',
      providerId: user.email,
      providerEmail: user.email,
      isVerified: user.isVerified,
      isPrimary: false, // OAuth identity remains primary
      linkedAt: new Date(),
    });
  }

  await user.save();
}

/**
 * Generate JWT tokens for authenticated user
 */
export function generateAuthTokens(user: UserAuth) {
  return generateTokenPair(user._id.toString(), user.email);
}

/**
 * Check if user can login with email/password
 */
export function canLoginWithEmail(user: UserAuth): boolean {
  return (
    user.hasPassword &&
    user.identities.some(
      (identity: AuthIdentity) => identity.provider === 'email'
    )
  );
}

/**
 * Get user's available login methods
 */
export function getUserLoginMethods(user: UserAuth): AuthProvider[] {
  return user.identities.map((identity: AuthIdentity) => identity.provider);
}
