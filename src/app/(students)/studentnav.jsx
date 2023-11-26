import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function studentnav() {
  return (
    <Box  >
      <AppBar >
        <Toolbar>
         
        <Typography
						variant="h4"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
                            ml : 10,
							
							fontFamily: "Roboto",
							fontWeight: 800,
							letterSpacing: ".4rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						SeatMe
					</Typography>
         
        </Toolbar>
      </AppBar>
    </Box>
  );
}