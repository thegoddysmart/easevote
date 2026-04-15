"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-secondary-100">
      <h1 className="font-russo text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
        Something went wrong!
      </h1>
      <p className="mt-4 max-w-md text-gray-600 dark:text-gray-400">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="mt-8">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="rounded-full bg-secondary-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
