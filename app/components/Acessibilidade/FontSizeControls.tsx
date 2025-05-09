"use client";
import React from "react";
import { Button, Stack } from "@mui/material";
import { useFontSize } from "../context/FontSizeContext";

const FontSizeControls = () => {
  const { increase, decrease, reset } = useFontSize();

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={increase}>
        A+
      </Button>
      <Button variant="contained" onClick={decrease}>
        A-
      </Button>
      <Button variant="outlined" onClick={reset}>
        Reset
      </Button>
    </Stack>
  );
};

export default FontSizeControls;
