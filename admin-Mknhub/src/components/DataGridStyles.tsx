import { SxProps, Theme } from "@mui/material";

export const defaultDataGridStyles: SxProps<Theme> = {
  "& .MuiDataGrid-row": {
    cursor: "pointer",
  },
  borderRadius: 4,
  overflow: "hidden",
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    padding: "0 12px",
    minHeight: 60,
    borderBottom: "solid 1px #F0F2F5",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: (theme) => theme.palette.info.light,
    fontWeight: "bold",
    borderBottom: "1px solid #E6E8EC",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    justifyContent: "flex-start",
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: "#ffffff",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#ffffff",
    borderTop: "1px solid #E6E8EC",
  },
  "& .MuiDataGrid-toolbarContainer": {
    backgroundColor: "transparent",
    borderBottom: "1px solid rgb(194, 186, 186)",
    padding: "8px",
  },
  "& .MuiDataGrid-columnHeader": {
    borderRight: "1px solid #e0e0e0",
  },

  "& .MuiDataGrid-columnHeader:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: (theme) => theme.palette.action.hover,
  },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: (theme) => theme.palette.primary.light,
  },
  "& .MuiDataGrid-row.Mui-selected:hover": {
    backgroundColor: (theme) => theme.palette.primary.main,
  },
};
