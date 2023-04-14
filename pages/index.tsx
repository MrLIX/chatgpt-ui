import * as React from "react";

import { Container, useTheme } from "@mui/joy";

import { Chat } from "@/components/Chat";
import { NoSSR } from "@/components/util/NoSSR";
import { isValidOpenAIApiKey, SettingsModal } from "@/components/dialogs/SettingsModal";
import { useSettingsStore } from "@/lib/store-settings";
import Loader from "@/components//util/Loader"; // Import the Loader component

export default function Home() {
  // state
  const [settingsShown, setSettingsShown] = React.useState(false);

  // external state
  const theme = useTheme();
  const apiKey = useSettingsStore((state) => state.apiKey);
  const centerMode = useSettingsStore((state) => state.centerMode);

  // show the Settings Dialog at startup if the API key is required but not set
  React.useEffect(() => {
    if (!!process.env.REQUIRE_USER_API_KEYS && !isValidOpenAIApiKey(apiKey)) setSettingsShown(true);
  }, [apiKey]);

  return (
    <NoSSR>
      <React.Suspense fallback={<Loader />}>
        <Container
          maxWidth={centerMode === "full" ? false : centerMode === "narrow" ? "md" : "xl"}
          disableGutters
          sx={{
            boxShadow: {
              xs: "none",
              md: centerMode === "narrow" ? theme.vars.shadow.md : "none",
              xl: centerMode !== "full" ? theme.vars.shadow.lg : "none",
            },
          }}
        >
          <Chat onShowSettings={() => setSettingsShown(true)} />

          <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />
        </Container>
      </React.Suspense>
    </NoSSR>
  );
}