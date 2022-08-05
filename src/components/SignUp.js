import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const navigate = useNavigate();
  const { name, email, password } = credential;
  const HandleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //  save the auth token and redirect
      localStorage.setItem("token", json.auth_token);
      navigate("/");
    } else {
      alert("Invalid ");
    }
  };
  const onchange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <form onSubmit={HandleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onchange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onchange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={onchange}
            id="password"
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            name="cPassword"
            onChange={onchange}
            id="cPassword"
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;
