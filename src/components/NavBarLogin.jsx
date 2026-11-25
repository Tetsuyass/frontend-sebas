import "../styles/NavBarLogin.css"
import logo from "../assets/avatars/lilith1.jpeg";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBarLogin() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async (e) => {
      e.preventDefault();
      setError("");
      //TODO : A changer

      navigate("/login")
  }

  const tarifications = async (e) => {
      e.preventDefault();
      setError("");
      //TODO : A changer

      navigate("/tarifs")
  }

    const contactComm = async (e) => {
      e.preventDefault();
      setError("");
      //TODO : A changer

      navigate("/get-help")
  }

    const trySebas = async (e) => {
      e.preventDefault();
      setError("");
      //TODO : A changer

      navigate("/try-sebas")
  }

  const returnLoginPage = async (e) => {
        e.preventDefault();
        setError("")

      navigate("/")
  }
    return (
        <div className="navbar-login">
            <div className="navbar-login-row" id="navbar-login-row-1">
                <a onClick={returnLoginPage}> Home</a> {/*A changer en image "maison" plus tard*/}
                <a onClick={login}>Se connecter</a>
                <a onClick={tarifications}>Tarifications</a>
                <a onClick={contactComm}>Obtenir de l'aide</a>
                <a onClick={trySebas}>Essayer Sebas</a>
            </div>
        </div>
    );
}