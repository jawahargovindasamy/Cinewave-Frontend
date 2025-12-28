import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
  InputGroup
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleSignup = () => {
    googleLogin();
  };

  return (
    <Container className="mt-5 py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Create Account</h2>
                <p className="text-muted">Sign up to get started</p>
              </div>

              {error && (
                <Alert variant="danger" className="rounded-3">
                  <small>{error}</small>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Name with icon */}
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="fw-semibold text-dark">
                    Full Name
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaUser className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-start-0 ps-0"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Email with icon */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-semibold text-dark">
                    Email Address
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-start-0 ps-0"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Password with icons */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="fw-semibold text-dark">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-start-0 border-end-0 ps-0"
                      required
                      minLength={6}
                    />
                    <InputGroup.Text
                      className="bg-light border-start-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-muted" />
                      ) : (
                        <FaEye className="text-muted" />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Must be at least 6 characters
                  </Form.Text>
                </Form.Group>

                {/* Confirm Password with icons */}
                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label className="fw-semibold text-dark">
                    Confirm Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border-start-0 border-end-0 ps-0"
                      required
                    />
                    <InputGroup.Text
                      className="bg-light border-start-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-muted" />
                      ) : (
                        <FaEye className="text-muted" />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {/* Register button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold rounded-3 mb-3"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Divider */}
                <div className="position-relative my-4">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    OR
                  </span>
                </div>

                {/* Google signup */}
                <Button
                  variant="outline-secondary"
                  className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3"
                  onClick={handleGoogleSignup}
                  size="lg"
                >
                  <FaGoogle className="text-danger" />
                  <span className="fw-semibold">Continue with Google</span>
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <span className="text-muted">Already have an account?</span>{' '}
            <Link to="/login" className="fw-bold text-decoration-none">
              Login
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;