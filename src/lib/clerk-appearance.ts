import type { ClerkAppearanceTheme } from "@clerk/nextjs/types";

export const clerkAppearance: ClerkAppearanceTheme = {
  variables: {
    colorPrimary: "var(--accent)",
    colorBackground: "var(--card)",
    colorForeground: "var(--foreground)",
    colorMutedForeground: "var(--muted)",
    colorInput: "var(--background)",
    colorInputForeground: "var(--foreground)",
    colorNeutral: "var(--foreground)",
    colorDanger: "var(--blush)",
    fontFamily: "var(--font-sans), sans-serif",
    borderRadius: "0.6rem",
  },
  elements: {
    card: {
      backgroundColor: "var(--card)",
      border: "1px solid var(--card-edge)",
      boxShadow: "0 10px 28px rgba(0, 0, 0, 0.1)",
    },
    headerTitle: {
      fontFamily: "var(--font-display)",
      color: "var(--foreground)",
    },
    headerSubtitle: {
      color: "var(--muted)",
    },
    formFieldLabel: {
      color: "var(--muted)",
    },
    formFieldInput: {
      backgroundColor: "var(--background)",
      borderColor: "var(--card-edge)",
      color: "var(--foreground)",
    },
    formButtonPrimary: {
      backgroundColor: "var(--accent)",
      color: "var(--card)",
      fontSize: "0.95rem",
      textTransform: "none",
      boxShadow: "none",
      "&:hover, &:focus": {
        backgroundColor: "var(--accent)",
        opacity: 0.85,
      },
    },
    footerActionLink: {
      color: "var(--accent)",
    },
    dividerLine: {
      backgroundColor: "var(--card-rule)",
    },
    dividerText: {
      color: "var(--muted)",
    },
    socialButtonsBlockButton: {
      borderColor: "var(--card-edge)",
      color: "var(--foreground)",
    },
    userButtonAvatarBox: {
      width: "1.75rem",
      height: "1.75rem",
    },
    userButtonPopoverCard: {
      backgroundColor: "var(--card)",
      border: "1px solid var(--card-edge)",
      boxShadow: "0 10px 28px rgba(0, 0, 0, 0.1)",
    },
    userButtonPopoverActionButton: {
      color: "var(--foreground)",
    },
    userButtonPopoverActionButtonIcon: {
      color: "var(--muted)",
    },
    userPreviewMainIdentifier: {
      color: "var(--foreground)",
    },
    userPreviewSecondaryIdentifier: {
      color: "var(--muted)",
    },
  },
};
