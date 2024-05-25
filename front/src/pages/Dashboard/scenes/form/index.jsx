import React, { useState, useEffect } from 'react';
import { Box, Button, useTheme, TextField, CircularProgress, Typography } from "@mui/material"; 
import { Formik } from "formik";
import * as yup from "yup";
//import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios"; 
import { useParams, useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
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

const Form = () => {
  const { id: clientId } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(true);
/**********************************************************************************/
//récupérer les détails du client lorsque l'ID envoyer de page gestionClients
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (clientId) {
        try {
          const response = await axios.get(`http://localhost:5005/api/v1/api/users/${clientId}`);
          const { name, email, role } = response.data;
          setInitialValues({ name, email, role });
        } catch (error) {
          console.error("Error fetching client details:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);
/**********************************************************************************************************/
  // Soumet le formulaire et effectue une requête HTTP en fonction de l'action (création ou mise à jour)
  const handleFormSubmit = async (values) => {
    try {
      if (clientId) {
        const updatedFields = {};
        for (const key in values) {
          if (values[key] !== initialValues[key]) {
            updatedFields[key] = values[key];
          }
        }
        await axios.put(`http://localhost:5005/api/users/${clientId}`, updatedFields);
        navigate('/dashboard');
      } else {
        await axios.post('http://localhost:5005/api/users', values);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error updating/creating client:", error);
    }
  };

  if (isLoading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="Modifier client" subtitle="Modifier un profil client" />
      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{ "& > div": {  undefined : "span 4" } }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom Complet"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Rôle"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Modifier l'utilisateur
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  role: yup.string().required("required"),
});

export default Form;
  
