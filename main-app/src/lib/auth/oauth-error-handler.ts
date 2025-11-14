import toast from "react-hot-toast";
export const handleOAuthError = (error: string | null) => {
  if (!error) {
    return;
  }

  switch (error) {
    case "use_email_login":
      toast.error(
        "Please use Email to login. This account was created with Email authentication.",
      );
      break;
    case "use_github_login":
      toast.error(
        "Please use GitHub to login. This account was created with GitHub authentication.",
      );
      break;
    case "use_google_login":
      toast.error(
        "Please use Google to login. This account was created with Google authentication.",
      );
      break;
    case "oauth_cancelled":
      toast.error("OAuth authentication was cancelled.");
      break;
    case "token_exchange_failed":
      toast.error("Authentication failed. Please try again.");
      break;
    case "user_data_fetch_failed":
      toast.error("Failed to fetch user data. Please try again.");
      break;
    case "no_email_access":
      toast.error("Email access is required. Please grant email permissions.");
      break;
    case "email_not_verified":
      toast.error("Please verify your email address with Google.");
      break;
    case "token_processing_failed":
      toast.error("Failed to process authentication tokens. Please try again.");
      break;
    case "no_tokens":
      toast.error("Authentication failed. No tokens received.");
      break;
    case "oauth_account_exists":
      toast.error(
        "This account was created with OAuth. Please use OAuth to login.",
      );
      break;
    default:
      toast.error("An error occurred during authentication. Please try again.");
  }
};
