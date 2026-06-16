"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ClientMutationOptions = {
  action: () => Promise<void>;
  errorMessage: string;
  onFailure?: () => void;
  onSuccess?: () => void;
  refreshOnSuccess?: boolean;
};

function formatMutationError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return `${fallback}: ${error.message}`;
  }

  return fallback;
}

export function useClientMutation() {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [isWorking, setIsWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function runMutation({
    action,
    errorMessage: fallbackErrorMessage,
    onFailure,
    onSuccess,
    refreshOnSuccess = true,
  }: ClientMutationOptions) {
    setIsWorking(true);
    setErrorMessage(null);

    const handleFailure = (error: unknown) => {
      console.error(`${fallbackErrorMessage}:`, error);
      onFailure?.();
      setErrorMessage(formatMutationError(error, fallbackErrorMessage));
    };

    let actionResult: Promise<void>;
    try {
      actionResult = action();
    } catch (error) {
      handleFailure(error);
      setIsWorking(false);
      return;
    }

    void actionResult
      .then(() => {
        onSuccess?.();
        if (refreshOnSuccess) {
          startTransition(() => router.refresh());
        }
      })
      .catch(handleFailure)
      .finally(() => {
        setIsWorking(false);
      });
  }

  return {
    errorMessage,
    isBusy: isRefreshing || isWorking,
    runMutation,
  };
}
