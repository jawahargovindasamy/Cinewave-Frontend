import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();

  // Check for Google OAuth callback
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <Container className="mt-5 py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                <p className="text-muted">Sign in to continue to your account</p>
              </div>

              {error && (
                <Alert variant="danger" className="rounded-3">
                  <small>{error}</small>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
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
                <Form.Group className="mb-4" controlId="password">
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-start-0 border-end-0 ps-0"
                      required
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
                </Form.Group>

                {/* Forgot password link */}
                <div className="text-end mb-3">
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none small"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login button */}
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
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                {/* Divider */}
                <div className="position-relative my-4">
                  <hr className="text-muted" />
                  <span
                    className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small"
                  >
                    OR
                  </span>
                </div>

                {/* Google login */}
                <Button
                  variant="outline-secondary"
                  className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3"
                  onClick={handleGoogleLogin}
                  size="lg"
                >
                  <FaGoogle className="text-danger" />
                  <span className="fw-semibold">Continue with Google</span>
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account?</span>{' '}
            <Link to="/register" className="fw-bold text-decoration-none">
              Create Account
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;