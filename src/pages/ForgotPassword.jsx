import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { passwordAPI } from '../services/api.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await passwordAPI.forgotPassword(email);
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Forgot Password?</h2>
                <p className="text-muted">
                  Enter your email and we'll send you a new password
                </p>
              </div>

              {message && (
                <Alert variant="success" className="rounded-3">
                  <small>{message}</small>
                </Alert>
              )}
              {error && (
                <Alert variant="danger" className="rounded-3">
                  <small>{error}</small>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Email with icon */}
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="fw-semibold text-dark">
                    Email Address
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="border-start-0 ps-0"
                      required
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    We'll send a new password to your email
                  </Form.Text>
                </Form.Group>

                {/* Reset button */}
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
                      Sending...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-decoration-none d-inline-flex align-items-center gap-2"
            >
              <FaArrowLeft size={14} />
              <span className="fw-semibold">Back to Login</span>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;