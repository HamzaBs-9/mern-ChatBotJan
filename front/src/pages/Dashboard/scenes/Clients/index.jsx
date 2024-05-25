import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios"; //
/**********************************************************************/
// Composant Header
const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};
/**********************************************************************/
// Composant Clients
const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clientsData, setClientsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  /******************************************************************************************************/
  // Effet qui se déclenche au chargement initial pour récupérer les données des clients depuis l'API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/v1/api/users");
        setClientsData(response.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);
  /**********************************************************************/
  // Configuration des colonnes du tableau de données
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ];
  /**********************************************************************/
  // Fonction pour extraire l'ID unique des données de la ligne
  const getRowId = (row) => row._id;

  if (isLoading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }
  /***************************************************************************/
  // Retourne le composant Clients avec le tableau de données des clients
  return (
    <Box m="20px">
      <Header title="clients" subtitle="Liste des informations des clients" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={clientsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
        />
      </Box>
    </Box>
  );
};

export default Clients; 
