"use client";

import { useEffect, useState } from "react";
import { PUNS, pick, type PunKey } from "./puns";

/**
 * Client-component hook: renders the first pool entry during SSR/initial
 * hydration (avoids a hydration mismatch), then swaps to a random pick
 * right after mount so the pun still randomizes on every page load.
 */
export function usePunned<K extends PunKey>(key: K): (typeof PUNS)[K][number] {
  const [value, setValue] = useState<(typeof PUNS)[K][number]>(PUNS[key][0]);
  useEffect(() => {
    setValue(pick(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
