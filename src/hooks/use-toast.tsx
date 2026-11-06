import * as React from "react";

import type { ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToastInput = Omit<ToastProps, "id" | "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

type ToasterToast = ToastInput & { id: string };

let count = 0;
let toasts: ToasterToast[] = [];
const listeners = new Set<() => void>();
const removalTimers = new Map<string, ReturnType<typeof setTimeout>>();

function getSnapshot() {
  return toasts;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setToasts(next: ToasterToast[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

function cancelRemoval(id: string) {
  const timer = removalTimers.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    removalTimers.delete(id);
  }
}

function scheduleRemoval(id: string) {
  if (removalTimers.has(id)) return;

  const timer = setTimeout(() => {
    removalTimers.delete(id);
    setToasts(toasts.filter((item) => item.id !== id));
  }, TOAST_REMOVE_DELAY);
  removalTimers.set(id, timer);
}

function dismiss(id?: string) {
  const matches = toasts.filter((item) => id === undefined || item.id === id);
  if (matches.length === 0) return;

  matches.forEach((item) => scheduleRemoval(item.id));
  setToasts(
    toasts.map((item) =>
      id === undefined || item.id === id ? { ...item, open: false } : item,
    ),
  );
}

function toast({ onOpenChange, ...props }: ToastInput) {
  const id = String(++count);
  let notifyOpenChange = onOpenChange;
  const handleOpenChange = (open: boolean) => {
    if (!open) dismiss(id);
    notifyOpenChange?.(open);
  };

  const next = [
    { ...props, id, open: true, onOpenChange: handleOpenChange },
    ...toasts,
  ];
  next.slice(TOAST_LIMIT).forEach((item) => cancelRemoval(item.id));
  setToasts(next.slice(0, TOAST_LIMIT));

  function update(changes: Partial<ToastInput>) {
    if (!toasts.some((item) => item.id === id)) return;
    if ("onOpenChange" in changes) notifyOpenChange = changes.onOpenChange;
    if (changes.open === true) cancelRemoval(id);
    if (changes.open === false) scheduleRemoval(id);

    setToasts(
      toasts.map((item) =>
        item.id === id
          ? { ...item, ...changes, id, onOpenChange: handleOpenChange }
          : item,
      ),
    );
  }

  return { id, update, dismiss: () => dismiss(id) };
}

function useToast() {
  const snapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
  return { toasts: snapshot, toast, dismiss };
}

export { toast, useToast };
