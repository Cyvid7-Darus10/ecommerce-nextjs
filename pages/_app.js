import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "../utils/Store";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <>
      {domLoaded && (
        <SessionProvider session={session}>
          <StoreProvider>
            <ThemeProvider>
              <Component {...pageProps} />
            </ThemeProvider>
          </StoreProvider>
        </SessionProvider>
      )}
    </>
  );
}

export default MyApp;
