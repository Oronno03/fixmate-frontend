"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function getSnapshot() {
  return new Date().getFullYear();
}

function getServerSnapshot() {
  return null;
}

export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <>{year ?? ""}</>;
}
