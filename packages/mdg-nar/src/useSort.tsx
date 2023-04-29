import { GridSortModel, DataGridPremiumProps } from "@mui/x-data-grid-premium";
import { useQuery } from "./useQuery";

const parseSortModel = (sortModelStr: string): GridSortModel => {
  if (!sortModelStr) {
    return [];
  }

  const [field, sort] = sortModelStr.split("~");
  return [{ field, sort: sort as "asc" | "desc" }];
};

// in the url we are going to represent the sortModel like so:
// ?sortBy=field~ASC
export const useSortModel = () => {
  const { searchParams, setParams } = useQuery();
  const sortModel = searchParams.get("sortModel");

  const onSortModelChange: DataGridPremiumProps["onSortModelChange"] = (
    newSortModel
  ) => {
    if (newSortModel.length === 0) {
      setParams({ sortModel: undefined });
    } else {
      const { field, sort } = newSortModel[0];
      setParams({ sortModel: `${field}~${sort}` });
    }
  };

  return {
    sortModel: sortModel ? parseSortModel(sortModel) : [],
    onSortModelChange,
  };
};
