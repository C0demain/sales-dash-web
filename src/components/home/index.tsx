import axios from "axios";
import { Button } from "baseui/button";
import { HeadingXXLarge } from "baseui/typography";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { SpacedButtonsContainer } from "../commons";

function Home() {
  const singOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    singOut();
    navigate("/login");
  };

  const getUsers = async () => {
    const response = await axios.get("http://localhost:8000/api/v1/auth/users", {
      withCredentials: true,
    });
    console.log("Response: ", response);
  };

  return (
    <SpacedButtonsContainer>
      <HeadingXXLarge color="secondary500">Bem Vindo a Home!</HeadingXXLarge>
      <Button kind="secondary" onClick={getUsers}>
        Visualizar Usuários
      </Button>
      <Button kind="secondary" onClick={logout}>
        Deslogar
      </Button>
    </SpacedButtonsContainer>
  );
}

export default Home;
