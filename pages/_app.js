import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "../utils/Store";
import { useEffect, useState } from "react";

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
            <Component {...pageProps} />
          </StoreProvider>
        </SessionProvider>
      )}
    </>
  );
}

export default MyApp;
