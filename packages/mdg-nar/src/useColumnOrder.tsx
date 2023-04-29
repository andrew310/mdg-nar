import React from "react";

import {
  type GridApi,
  gridColumnFieldsSelector,
} from "@mui/x-data-grid-premium";

import { useLocalStorage } from "usehooks-ts";

export type UseColumnOrderProps = {
  key: string;
  initialState?: string[];
};

/**
 * Column order gets persisted in local storage,
 * because it only gets read on the client.
 */
export const useColumnOrder = (
  apiRef: React.MutableRefObject<GridApi>,
  { key, initialState = [] }: UseColumnOrderProps
) => {
  const [state, setState] = useLocalStorage(key, initialState);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent("columnHeaderDragEnd", () =>
      setState(gridColumnFieldsSelector(apiRef))
    );
  }, [apiRef]);

  return state;
};
