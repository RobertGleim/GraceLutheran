import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './AdminView.css';

function AdminView() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pastor-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or update message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem('token');
    const url = editingId 
      ? `${API_URL}/pastor-messages/${editingId}`
      : `${API_URL}/pastor-messages`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ title: '', message: '' });
        setEditingId(null);
        fetchMessages();
        alert(editingId ? 'Message updated!' : 'Message created!');
      }
    } catch (error) {
      console.error('Error saving message:', error);
      alert('Error saving message');
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/pastor-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMessages();
        alert('Message deleted!');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  // Activate message
  const handleActivate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/pastor-messages/${id}/activate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMessages();
        alert('Message activated!');
      }
    } catch (error) {
      console.error('Error activating message:', error);
      alert('Error activating message');
    }
  };

  // Edit message
  const handleEdit = (message) => {
    setFormData({ title: message.title, message: message.message });
    setEditingId(message.id);
  };

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-view">
      <h1>Pastor Messages Admin</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="message-form">
        <h2>{editingId ? 'Edit Message' : 'Create New Message'}</h2>
        
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>
        
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setFormData({ title: '', message: '' });
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Messages List */}
      <div className="messages-list">
        <h2>All Messages</h2>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-card ${msg.is_active ? 'active' : ''}`}>
              <h3>{msg.title}</h3>
              <p>{msg.message}</p>
              <div className="message-actions">
                {msg.is_active ? (
                  <span className="active-badge">ACTIVE</span>
                ) : (
                  <button onClick={() => handleActivate(msg.id)}>
                    Activate
                  </button>
                )}
                <button onClick={() => handleEdit(msg)}>Edit</button>
                <button onClick={() => handleDelete(msg.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminView;