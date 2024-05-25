import React, { useEffect, useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
 // const [isSubmitting, setIsSubmitting] = useState(false); // State to manage form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    //if (isSubmitting) return; // Prevent multiple submissions
    //setIsSubmitting(true); // Disable submit button
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = "user"; // Set a default role
    try {
      const response = await axios.post(
        "http://localhost:5005/api/v1/user/signup",
        {
          name,
          email,
          password,
          role,
        }
      );

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", email);
      } 
      toast.loading("Signing Up", { id: "signup" });
      await auth.signup(name, email, password, role);
      toast.success("Signed Up Successfully", { id: "signup" });
      navigate("/chat")
    } catch (error) {
      console.log(error);
      toast.error( "Signing Up Failed", { id: "signup" });
    } /*finally {
      setIsSubmitting(false); // Re-enable submit button
    }*/
  };

  useEffect(() => {
    if (auth?.user) {
       navigate("/chat");
    }
  }, [auth, navigate]);

  return (
    <Box width={"100%"} height={"100%"} display="flex" flex={1}>
      <Box padding={1} mt={1} display={{ md: "flex", sm: "none", xs: "none" }}>
        <img src="airobot.png" alt="Robot" style={{ width: "400px" }} />
      </Box>
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={6}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              padding={2}
              fontWeight={600}
            >
              Signup
            </Typography>
            <CustomizedInput type="text" name="name" label="Name" />
            <CustomizedInput type="email" name="email" label="Email" />
            <CustomizedInput type="password" name="password" label="Password" />
            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#00fffc",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
              endIcon={<IoIosLogIn />}
              //disabled={isSubmitting} // Disable the button while submitting
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;