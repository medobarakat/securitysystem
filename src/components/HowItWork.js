import React, { useState } from "react";
import { Popover, Typography } from "@mui/material";

const HowItWork = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <div className="howWrapper" onClick={handleClick}>How It Works</div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>Safe Home Pros services hundreds of brands and provides trusted information for millions of individuals across the United States</Typography>
        <ul>
            <li>Easily compare competitors</li>
            <li>Strengthen your consumer awareness</li>
            <li>Find the best rates for your financial needs</li>

        </ul>
      </Popover>
    </>
  );
};

export default HowItWork;
