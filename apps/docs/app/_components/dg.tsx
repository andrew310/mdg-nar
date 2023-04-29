"use client";
import React from "react";

import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
} from "@mui/x-data-grid-premium";

import { useColumnOrder, usePagination, useSortModel } from "mdg-nar";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "firstName",
    headerName: "First name",
    width: 130,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 130,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: ({ row }) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Martell", firstName: "Oberyn", age: 45 },
  { id: 8, lastName: "Tyrell", firstName: "Mace", age: 50 },
  { id: 9, lastName: "Frey", firstName: "Walder", age: 76 },
];

export function DG() {
  const apiRef = useGridApiRef();
  const colOrder = useColumnOrder(apiRef, { key: "colOrder" });
  const paginationModel = usePagination(apiRef);
  const { sortModel, onSortModelChange } = useSortModel();

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGridPremium
        autoHeight
        apiRef={apiRef}
        rows={rows}
        rowCount={rows.length}
        pagination={true}
        sortingMode="client"
        pageSizeOptions={[5, 10, 20, 50, 100]}
        paginationMode="client"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        columns={columns}
        checkboxSelection
        density="compact"
        initialState={{
          columns: {
            orderedFields: colOrder,
          },
          pagination: {
            paginationModel
          }
        }}
      />
    </div>
  );
}
