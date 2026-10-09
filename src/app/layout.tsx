import { ClerkProvider } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { ebGaramond, jetbrainsMono, karla } from '@/app/fonts';
import SignInPrompt from '@/components/auth/sign-in-prompt';
import JsonLd from '@/components/json-ld';
import GlobalProvider from '@/context/global-provider';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { THEME_COOKIE_NAME } from '@/lib/constants/theme';
import { parseTheme } from '@/lib/utils/parse-theme';
import './globals.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);
  const accessLevel = await getAccessLevel();

  return (
    <html
      lang='en'
      className={`${ebGaramond.variable} ${jetbrainsMono.variable} ${karla.variable} ${
        theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : ''
      }`}
    >
      <head>
        {/* DNS prefetch is not available via Metadata API */}
        <meta httpEquiv='x-dns-prefetch-control' content='off' />
        <link rel='dns-prefetch' href='//lefog.xyz/' />
        <link rel='preconnect' href='https://lefog.xyz/' />
        <JsonLd />
      </head>
      <body className='antialiased'>
        <ClerkProvider dynamic>
          <GlobalProvider theme={theme}>
            {children}
            {accessLevel === 'guest' && <SignInPrompt />}
          </GlobalProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
