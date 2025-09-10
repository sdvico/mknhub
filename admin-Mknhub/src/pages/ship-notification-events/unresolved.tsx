import React from "react";
import { ShipNotificationEventList } from "./list";

export const UnresolvedEventsPage: React.FC = () => {
  return (
    <ShipNotificationEventList showUnresolvedOnly={true} defaultView="table" />
  );
};
