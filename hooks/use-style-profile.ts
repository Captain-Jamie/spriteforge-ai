"use client";

import { useEffect, useMemo, useState } from "react";
import type { StyleProfile } from "@/lib/asset-schema";
import {
  clearStoredStyleProfile,
  loadStyleProfile,
  saveStyleProfile
} from "@/lib/asset-storage";
import { StyleProfileSchema } from "@/lib/asset-schema";

const emptyStyleProfile = StyleProfileSchema.parse({});

export function useStyleProfile() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [styleProfile, setStyleProfile] = useState<StyleProfile>(emptyStyleProfile);

  useEffect(() => {
    setStyleProfile(loadStyleProfile());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    saveStyleProfile(styleProfile);
  }, [hasHydrated, styleProfile]);

  const appliedStyleProfile = useMemo(
    () => Object.values(styleProfile).filter((value) => value.trim().length > 0).length,
    [styleProfile]
  );

  function updateStyleProfileField(field: keyof StyleProfile, value: string) {
    setStyleProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value
    }));
  }

  function resetStyleProfile() {
    setStyleProfile(emptyStyleProfile);
    clearStoredStyleProfile();
  }

  return {
    appliedStyleProfile,
    hasHydrated,
    resetStyleProfile,
    styleProfile,
    updateStyleProfileField
  };
}
