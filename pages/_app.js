import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <>
      {domLoaded && (
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      )}
    </>
  );
}

export default MyApp;
