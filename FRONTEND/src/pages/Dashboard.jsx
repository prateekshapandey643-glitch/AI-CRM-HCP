import Navbar from "../components/Navbar/Navbar";
import { Container, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <Navbar />

      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Welcome to AI CRM HCP Module
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/log-interaction"
        >
          Log HCP Interaction
        </Button>
      </Container>
    </>
  );
}

export default Dashboard;