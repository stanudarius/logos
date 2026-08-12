import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type PhoneTab = "explore" | "vault" | "trails" | "trail-view";

interface NavigationContextType {
  phoneTab: PhoneTab;
  setPhoneTab: (tab: PhoneTab) => void;
  activeExploreIndex: number;
  setActiveExploreIndex: (idx: number) => void;
  activeTrailIndex: number;
  setActiveTrailIndex: (idx: number) => void;
  isConstellationOpen: boolean;
  setIsConstellationOpen: (open: boolean) => void;
  isZenModeOpen: boolean;
  setIsZenModeOpen: (open: boolean) => void;
  isDeepDiveOpen: boolean;
  setIsDeepDiveOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [phoneTab, setPhoneTab] = useState<PhoneTab>("explore");
  const [activeExploreIndex, setActiveExploreIndex] = useState(0);
  const [activeTrailIndex, setActiveTrailIndex] = useState(0);

  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  useEffect(() => {
    let route = `/${phoneTab}`;
    if (isZenModeOpen) route = "/zen-mode";
    else if (isConstellationOpen) route = "/constellation";

    if (window.location.pathname !== route) {
      if (isZenModeOpen || isConstellationOpen) {
        window.history.pushState(null, "", route);
      } else {
        window.history.replaceState(null, "", route);
      }
    }
  }, [phoneTab, isZenModeOpen, isConstellationOpen]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/zen-mode") {
        setIsZenModeOpen(true);
        setIsConstellationOpen(false);
      } else if (path === "/constellation") {
        setIsConstellationOpen(true);
        setIsZenModeOpen(false);
      } else {
        setIsZenModeOpen(false);
        setIsConstellationOpen(false);
        const tab = path.replace("/", "") as PhoneTab;
        if (
          tab === "explore" ||
          tab === "vault" ||
          tab === "trails" ||
          tab === "trail-view"
        ) {
          setPhoneTab(tab);
        } else {
          setPhoneTab("explore");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const value = React.useMemo(
    () => ({
      phoneTab,
      setPhoneTab,
      activeExploreIndex,
      setActiveExploreIndex,
      activeTrailIndex,
      setActiveTrailIndex,
      isConstellationOpen,
      setIsConstellationOpen,
      isZenModeOpen,
      setIsZenModeOpen,
      isDeepDiveOpen,
      setIsDeepDiveOpen,
    }),
    [
      phoneTab,
      activeExploreIndex,
      activeTrailIndex,
      isConstellationOpen,
      isZenModeOpen,
      isDeepDiveOpen,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
