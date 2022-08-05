import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { email, password } = credential;
  const Handlesubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //  save the auth token and redirect
      localStorage.setItem("token", json.auth_token);
      navigate("/");
    } else {
      alert("invalid");
    }
  };

  const onchange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <form onSubmit={Handlesubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={credential.email}
            onChange={onchange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credential.password}
            onChange={onchange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
