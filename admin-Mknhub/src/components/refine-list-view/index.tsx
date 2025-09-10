import { List, type ListProps } from "@refinedev/mui";

type Props = {} & ListProps;

export const RefineListView = ({ children, ...props }: Props) => {
  return (
    <List
      {...props}
      headerProps={{
        sx: {
          display: "flex",
          flexWrap: "wrap",
          ".MuiCardHeader-action": {
            margin: 0,
            alignSelf: "center",
          },
          height: "72px",
          px: 1,
        },
        ...props.headerProps,
      }}
      headerButtonProps={{
        alignItems: "center",
        ...props.headerButtonProps,
      }}
      wrapperProps={{
        sx: {
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          border: "none",
          px: 0,
          py: 0,
          ...props.wrapperProps?.sx,
        },
      }}
    >
      {children}
    </List>
  );
};
