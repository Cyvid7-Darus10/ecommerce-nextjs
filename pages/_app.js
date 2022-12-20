import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { StoreProvider } from "../utils/Store";
import { useRouter } from "next/router";
import { ThemeProvider } from "@material-tailwind/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <ThemeProvider>
          <PayPalScriptProvider deferLoading={true}>
            {Component.auth ? (
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </PayPalScriptProvider>
        </ThemeProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}

export default MyApp;
