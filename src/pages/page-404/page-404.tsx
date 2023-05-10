import React from "react";
import { Box } from "devextreme-react";
import { useI18n } from "@/i18n/useI18n";

export const Page404 = () => {
  const { m } = useI18n("Common");
  React.useEffect(() => {
    document.title = m("pageNotFound");
    return () => {
      document.title = m("pageNotFound");
    };
  }, []);

  return (
    <Box>
      <img src="/img/404.jpg" alt='page not found' />
    </Box>
  );
};

