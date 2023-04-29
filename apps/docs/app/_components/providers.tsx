"use client";
import * as React from "react";
import { StyledEngineProvider } from "@mui/material/styles";

import { LicenseInfo } from "@mui/x-data-grid-pro";

LicenseInfo.setLicenseKey(process.env.MUI_X_LICENSE_KEY || "");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      {/* Your component tree. Now you can override MUI's styles. */}
      {children}
    </StyledEngineProvider>
  );
}
