import {
  DataGridPremiumProps,
  GridPaginationModel,
} from "@mui/x-data-grid-premium";

import useCookie from "react-use-cookie";

import { useQuery } from "./useQuery";

type Opts = {
  defaultPageSize?: number;
};

/**
 * There is no need to persist the `page`` outside of the URL.
 * However, the user's `pageSize` preference should be persisted.
 * We use a cookie over local storage because in the event the user visits the url without the query params,
 * your server should use the cookie value as the default page size.
 */
export const usePagination = (opts?: Opts) => {
  const { defaultPageSize = 10 } = opts || {};
  const { searchParams, setParams } = useQuery();
  // const [_cookiePageSize, _setPageSize] = useCookie("pageSize", "10");

  const onPaginationModelChange: DataGridPremiumProps["onPaginationModelChange"] =
    ({ page, pageSize }) => {

      // set the page size in the cookie
      // _setPageSize(pageSize.toString());
      setParams({
        page: ((page || 0) + 1).toString(),
        pageSize: pageSize.toString(),
      });
    };

  const paginationModel: GridPaginationModel = {
    page: parseInt(searchParams.get("page") || "1") - 1,
    pageSize: parseInt(
      searchParams.get("pageSize") ||
      defaultPageSize.toString()
    ),
  };

  return { paginationModel, onPaginationModelChange };
};
