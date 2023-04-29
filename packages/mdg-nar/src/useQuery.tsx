import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQuery = () => {
  const pathname = usePathname();
  const readOnlySearchParams = useSearchParams();
  const router = useRouter();

  const [_isPending, startTransition] = React.useTransition();

  const searchParams = new URLSearchParams(readOnlySearchParams.toString());

  const setParams = (params: Record<string, string | undefined>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    const url = `${pathname}?${searchParams.toString()}`;

    startTransition(() => {
      router.push(url, { forceOptimisticNavigation: true });
    });
  };

  return { searchParams, setParams };
};
