import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**********************************************************************/
// Header Component
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
const GestionClients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClickOpen = (id) => {
    setSelectedRowId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRowId(null);
  };
  /**********************************************************************/
  // Récupère les données des client depuis une API lors du chargement initial
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/v1/api/users");
        setUserData(
          response.data.map((user) => ({ ...user, id: user._id.toString() }))
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /**********************************************************************/
  // Supprime un client après confirmation
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5005/api/v1/api/users/${selectedRowId}`);
      setUserData(userData.filter((user) => user.id !== selectedRowId));
      handleClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  /**********************************************************************/
  // Redirige vers la page d'form pour modifier le client sélectionné

  const handleEditRow = (id) => {
    navigate(`/dashboard/form/${id}`);
  };

  const columns = [
    
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton onClick={() => handleClickOpen(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleEditRow(row.id)}>
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Gestion des utilisateurs"
        subtitle="Gestion des informations des utilisateurs"
      />
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
        }}
      >
        <DataGrid checkboxSelection rows={userData} columns={columns} />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionClients;
