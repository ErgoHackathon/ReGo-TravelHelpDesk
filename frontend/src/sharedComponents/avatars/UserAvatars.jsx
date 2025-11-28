import React from "react";
import { Avatar } from "@mui/material";

export default function UserAvatar({ firstName, lastName }) {
  return (
    <Avatar
      sx={{
        width: 60,
        height: 60,
        bgcolor: "#b22a2a",
        fontSize: "1.4rem",
        fontWeight: "bold",
      }}
    >
      {firstName[0]}
      {lastName[0]}
    </Avatar>
  );
}
