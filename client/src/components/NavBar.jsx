import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Notification from "./chat/Notification";

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="navDiv">
      <h2>
        <Link to={"/"} className="link-light text-decoration-none">
          ChatShiya
        </Link>
      </h2>
      {user && <span>Logged in as {user?.name}</span>}
      <div style={{ display: "flex", gap: "30px" }}>
        {user && (
          <>
            <Notification />
            <Link
              onClick={() => logoutUser()}
              to={"/login"}
              className="link-light text-decoration-none"
            >
              Logout
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to={"/login"} className="link-light text-decoration-none">
              Login
            </Link>
            <Link to={"/register"} className="link-light text-decoration-none">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
