import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "../utils/Store";
import { ThemeProvider } from "@material-tailwind/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;
