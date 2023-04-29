"use client";
import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useCookie from "react-use-cookie";

import {
  DataGridProProps,
  GridApiCommon,
  gridColumnFieldsSelector,
  GridSortModel
} from "@mui/x-data-grid-pro";

import useLocalStorage from "./useLocalStorage";

export type UseColumnOrderProps = {
  key: string;
  initialState?: string[];
};

/**
 * Column order gets persisted in local storage,
 * because it only gets read on the client.
 */
export const useColumnOrder = (
  apiRef: React.MutableRefObject<GridApiCommon>,
  { key, initialState = [] }: UseColumnOrderProps,
) => {
  const [state, setState] = useLocalStorage(key, initialState);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(
      "columnHeaderDragEnd",
      () => setState(gridColumnFieldsSelector(apiRef)),
    );
  }, [apiRef]);

  return state;
};

/**
 * There is no need to persist the page outside of the URL.
 */
export const usePage = () => {
  const pathname = usePathname();
  const readOnlySearchParams = useSearchParams();
  const router = useRouter();

  const searchParams = new URLSearchParams(readOnlySearchParams.toString());

  const onPageChange: DataGridProProps["onPageChange"] = (newPage) => {
    searchParams.set("page", (newPage + 1).toString());
    const url = `${pathname}?${searchParams.toString()}`;
    router.push(url, { forceOptimisticNavigation: true });
  };

  const page = parseInt(searchParams.get("page") || "1") - 1;
  return { page, onPageChange };
};

type Opts = {
  defaultPageSize?: number;
};

export const usePageSize = (opts?: Opts) => {
  let { defaultPageSize = 10 } = opts || {};

  const pathname = usePathname();
  const readOnlySearchParams = useSearchParams();
  const router = useRouter();

  const [_cookiePageSize, _setPageSize] = useCookie("pageSize", "10");

  const setPageSize = (newPageSize: number) => {
    searchParams.set("pageSize", newPageSize.toString());
    _setPageSize(newPageSize.toString());
  };

  const searchParams = new URLSearchParams(readOnlySearchParams.toString());
  const pageSize = parseInt(
    searchParams.get("pageSize") || _cookiePageSize ||
    defaultPageSize.toString(),
  );

  const onPageSizeChange: DataGridProProps["onPageSizeChange"] = (
    newPageSize,
  ) => {
    setPageSize(newPageSize);
    const url = `${pathname}?${searchParams.toString()}`;
    router.push(url, { forceOptimisticNavigation: true });
  };

  return { pageSize, onPageSizeChange };
};

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

const parseSortModel = (sortModelStr: string): GridSortModel => {
  if (!sortModelStr) {
    return [];
  }

  const [field, sort] = sortModelStr.split("~");
  return [{ field, sort: sort as "asc" | "desc" }];
}

// in the url we are going to represent the sortModel like so:
// ?sortBy=field~ASC
export const useSortModel = () => {
  const { searchParams, setParams } = useQuery();
  const sortModel = searchParams.get("sortModel");

  const onSortModelChange: DataGridProProps["onSortModelChange"] = (
    newSortModel,
  ) => {
    if (newSortModel.length === 0) {
      setParams({ "sortModel": undefined })
    } else {
      const { field, sort } = newSortModel[0];
      setParams({ "sortModel": `${field}~${sort}` })
    }
  };

  return {
    sortModel: sortModel ? parseSortModel(sortModel) : [],
    onSortModelChange,
  };
};
