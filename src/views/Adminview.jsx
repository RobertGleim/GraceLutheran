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
        const result = await response.json();
        // Backend returns { message: "...", data: {...} }
        const newMessage = result.data || result;
        
        // If creating a new message (not editing), automatically activate it
        if (!editingId && newMessage.id) {
          // Don't await - let it run in background
          handleActivate(newMessage.id, false).then(() => {
            fetchMessages();
          });
        } else {
          fetchMessages();
          // Dispatch event for updates too
          window.dispatchEvent(new Event('pastorMessageUpdated'));
        }
        
        setFormData({ title: '', message: '' });
        setEditingId(null);
        
        // Use setTimeout to prevent blocking
        setTimeout(() => {
          alert(editingId ? 'Message updated!' : 'Message created and activated!');
        }, 0);
      } else {
        // Log error details
        const errorData = await response.text();
        console.error('Error response:', response.status, errorData);
        alert(`Error saving message: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error saving message:', error);
      alert('Error saving message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pastor-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMessages();
        setTimeout(() => alert('Message deleted!'), 0);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    } finally {
      setLoading(false);
    }
  };

  // Activate message
  const handleActivate = async (id, showAlert = true) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pastor-messages/${id}/activate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMessages(); // Refresh the list to show updated active status
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('pastorMessageUpdated'));
        
        if (showAlert) {
          setTimeout(() => alert('Message activated!'), 0);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error activating message:', error);
      if (showAlert) {
        alert('Error activating message');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edit message
  const handleEdit = (message) => {
    console.log('Edit button clicked for message:', message);
    setFormData({ title: message.title, message: message.message });
    setEditingId(message.id);
    
    // Scroll to the form when editing
    const formElement = document.querySelector('.message-form');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-view">
      <h1>Pastor Messages Admin</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className={`message-form ${editingId ? 'editing' : ''}`}>
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
          messages
            .sort((a, b) => {
              // Sort by active status first (active messages at top)
              if (a.is_active && !b.is_active) return -1;
              if (!a.is_active && b.is_active) return 1;
              // Then sort by ID in descending order (newest first)
              return b.id - a.id;
            })
            .map((msg) => (
            <div key={msg.id} className={`message-card ${msg.is_active ? 'active' : ''} ${editingId === msg.id ? 'being-edited' : ''}`}>
              <h3>{msg.title} {editingId === msg.id && <span className="editing-indicator">(Editing)</span>}</h3>
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