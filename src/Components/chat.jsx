import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Row, Col, Form, Button, ListGroup, Alert } from 'react-bootstrap';

const socket = io('http://localhost:5000'); // Replace with your server URL

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') {
      setError('Message cannot be empty');
      return;
    }
    socket.emit('chat message', message);
    setMessage('');
    setError(null);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h2 className="text-center">Real-time Chat</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="chat-box border p-3 mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
            <ListGroup>
              {messages.map((msg, index) => (
                <ListGroup.Item key={index}>{msg}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <Button type="submit" variant="primary" className="mt-2 w-100">
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
