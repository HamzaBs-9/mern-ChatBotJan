import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
  ListItemAvatar,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";

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

// Composant principal ConsulterDiscussion
const ConsulterDiscussion = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [discussionHistory, setDiscussionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des données des clients
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/v1/api/users");
        setClients(
          response.data.map((client) => ({
            ...client,
            id: client._id.toString(),
          }))
        );
        setFilteredClients(
          response.data.map((client) => ({
            ...client,
            id: client._id.toString(),
          }))
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données des clients:",
          error
        );
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, []);

  // Chargement de l'historique de discussion pour un client sélectionné
  useEffect(() => {
    if (selectedClient) {
      const fetchDiscussionHistory = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5005/api/v1/api/users/${selectedClient.id}/chats`
          );
          setDiscussionHistory(response.data.chats || []); // Assurez-vous de vérifier la structure de votre réponse pour obtenir les chats corrects
        } catch (error) {
          console.error(
            "Erreur lors du chargement de l'historique des discussions:",
            error
          );
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDiscussionHistory();
    }
  }, [selectedClient]);
  // Fonction de filtrage des clients par nom
  const handleClientFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm)
    );
    setFilteredClients(filtered);
  };

  // Composant ClientList pour afficher la liste des clients
  function ClientList({ clients, onSelectClient, isLoading, error }) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredClients = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
      return (
        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      );
    }

    if (error) {
      return (
        <Grid item xs={4}>
          <Typography variant="body1" color="error">
            Erreur lors du chargement des clients
          </Typography>
        </Grid>
      );
    }

    return (
      <Grid item xs={4}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", marginBottom: "10px", color: "#6AD4DD" }}
        >
          Liste des Clients
        </Typography>
        <Box
          border={1}
          height="70vh"
          padding="10px"
          marginRight={"10px"}
          borderColor="grey.300"
          borderRadius={2}
        >
          <TextField
            label="Rechercher un client"
            variant="outlined"
            fullWidth
            onChange={handleClientFilter}
            margin="normal"
            sx={{ width: "90%" }}
          />
          <List style={{ width: "100%", maxHeight: "60vh", overflow: "auto" }}>
            {filteredClients.map((client) => (
              <ListItem
                key={client.id}
                button
                onClick={() => onSelectClient(client)}
              >
                <ListItemAvatar>
                  <Avatar>{client.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${client.name} (${client.email})`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="Consulter Discussion"
        subtitle="Consulter les historiques de discussion des clients"
      />
      <Grid
        container
        spacing={3}
        style={{
          backgroundColor: "rgba(238, 247, 255,0.7)",
          marginLeft: "10px",
          marginTop: "20px",
          height: "80vh",
          width: "95%",
          borderRadius: "20px",
        }}
      >
        <ClientList
          clients={filteredClients}
          onSelectClient={setSelectedClient}
          isLoading={isLoading}
          error={error}
        />
        <Grid item xs={8}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", marginBottom: "10px", color: "#6AD4DD" }}
          >
            Discussion
          </Typography>
          <Box
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            width={"100vh"}
            p={2}
            height="70vh"
            overflow="auto"
          >
            {selectedClient ? (
              <div>
                <Typography
                  variant="h6"
                  gutterBottom
                >{`Historique de discussion avec ${selectedClient.name}`}</Typography>
                <List>
                  {discussionHistory.map((message, index) => (
                    <ListItem key={index} sx={{ marginBottom: "10px" }}>
                      <ListItemAvatar>
                        <Avatar>{message.role === "user" ? "U" : "A"}</Avatar>
                      </ListItemAvatar>
                      <Box
                        bgcolor={
                          message.role === "user" ? "#CAF4FF" : "#BFCFE7"
                        }
                        p={1}
                        borderRadius="10px"
                        maxWidth="80%"
                      >
                        <Typography
                          variant="body1"
                          sx={{ wordWrap: "break-word" }}
                        >
                          {/* Add labels before the messages */}
                          <strong>
                            {" "}
                            {message.role === "user" ? "Client: " : "Chatbot: "}
                          </strong>
                          {message.content}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </div>
            ) : (
              <Typography variant="body1">
                Sélectionnez un client pour afficher l'historique de discussion
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsulterDiscussion;
