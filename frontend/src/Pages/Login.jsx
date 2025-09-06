import React, { useState } from "react";
import API from "../Services/api.js";
import { Link, useNavigate } from "react-router-dom";
import './css/sk.css';
import logo from './css/Daco_367500.png';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || 'Login Failed');
      setLoading(false);
      handleShowModal();
    }
  };

  return (
    <div className="bg d-flex align-items-center justify-content-center">
      <div className="container mt-3 d-flex align-items-center justify-content-center" id="box1">
        <div className="row w-100 h-100 d-flex align-items-center justify-content-center g-2">
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="card bg-transparent border-0 d-flex align-items-center justify-content-center">
              <img src={logo} className="img-fluid" id="im1" alt="BEAST MOTORS logo" />
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="row w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="col-md-12 d-flex align-items-center justify-content-center">
                <h3>BEAST MOTORS</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <span className="input-group-text" id="inputGroup-sizing-default">Password</span>
                  <input
                    type="password"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-check">
                  <div>
                    <input className="form-check-input" type="checkbox" value="" id="form2Example31" defaultChecked />
                    <label className="form-check-label" htmlFor="form2Example31">
                      <p>Remember me</p>
                    </label>
                  </div>
                </div>
                <div>
                  <button id="btn1" type="submit" className="btn btn-primary btn-block">
                    {loading ? (
                      <i className="fa-solid fa-circle-notch fa-spin fa-xl"></i>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
                <div className="text-center mt-2">
                  <p>Not a member? <Link to="/signup">Register</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}