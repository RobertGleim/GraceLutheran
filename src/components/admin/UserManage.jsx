import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import API_URL from '../../config/api';
import './UserManage.css';

function UserManage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      // fail silently
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name || '', email: u.email || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '' });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    // client-side validation
    if (!form.name || form.name.trim() === '') {
      alert('Name cannot be empty.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    // Build minimal payload with only changed fields
    const original = users.find(u => u.id === id) || {};
    const payload = {};
    if ((form.name || '') !== (original.name || '')) payload.name = form.name;
    if ((form.email || '') !== (original.email || '')) payload.email = form.email;

    if (Object.keys(payload).length === 0) {
      // nothing changed
      setEditingId(null);
      setForm({ name: '', email: '' });
      setLoading(false);
      return;
    }

    const tryRequest = async (method, extraHeaders = {}, body = payload) => {
      return fetch(`${API_URL}/users/${id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...extraHeaders
        },
        body: JSON.stringify(body)
      });
    };

    try {
      // Try PUT
      let res = await tryRequest('PUT');

      // If PUT failed with 400/405 try PATCH
      if (!res.ok && (res.status === 400 || res.status === 405)) {
        res = await tryRequest('PATCH');
      }

      // If still not ok, try POST override
      if (!res.ok && (res.status === 400 || res.status === 405 || res.type === 'opaque')) {
        res = await tryRequest('POST', { 'X-HTTP-Method-Override': 'PUT' }, payload);
      }

      if (res.ok) {
        await fetchUsers();
        setEditingId(null);
        setForm({ name: '', email: '' });
      } else {
        // try to parse backend error message
        let errMsg = `Error saving user (status ${res.status}).`;
        try {
          const errJson = await res.json();
          if (errJson?.error) errMsg = errJson.error;
          else if (errJson?.message) errMsg = errJson.message;
          else if (typeof errJson === 'string') errMsg = errJson;
        } catch {
          // ignore parse error - silently handle JSON parsing errors
        }
        alert(errMsg);
      }
    } catch {
      alert('Network error while saving user. Check server or CORS settings.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (u) => {
    if (!window.confirm(`Change admin status for ${u.email}?`)) return;
    const token = localStorage.getItem('token');
    setLoading(true);
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    const payload = { role: newRole };

    const tryRequestRole = async (method, extraHeaders = {}, body = payload) => {
      return fetch(`${API_URL}/users/${u.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...extraHeaders
        },
        body: JSON.stringify(body)
      });
    };

    try {
      // Try PUT first
      let res = await tryRequestRole('PUT');

      // Fallback to PATCH if needed
      if (!res.ok && (res.status === 400 || res.status === 405)) {
        res = await tryRequestRole('PATCH');
      }

      // Fallback to POST with override
      if (!res.ok) {
        res = await tryRequestRole('POST', { 'X-HTTP-Method-Override': 'PUT' }, payload);
      }

      if (res.ok) {
        setUsers((prev) => prev.map(p => p.id === u.id ? { ...p, role: newRole } : p));
      } else {
        let errMsg = `Error changing role (status ${res.status}).`;
        try {
          const errJson = await res.json();
          if (errJson?.error) errMsg = errJson.error;
          else if (errJson?.message) errMsg = errJson.message;
        } catch {
          // ignore JSON parsing errors
        }
        alert(errMsg);
      }
    } catch {
      alert('Network error while updating role. Check server/CORS.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') return <div>Access denied. Admin only.</div>;

  return (
    <div className="user-manage">
      <h1>User Management</h1>
      <p className="subtitle">View and manage site users. Edit details or toggle admin privileges.</p>

      <div className="user-table-wrap">
        <table className="user-table" role="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="4">No users found.</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
                <td>
                  {editingId === u.id ? (
                    <input name="name" value={form.name} onChange={handleChange} />
                  ) : (
                    u.name
                  )}
                </td>
                <td>
                  {editingId === u.id ? (
                    <input name="email" value={form.email} onChange={handleChange} />
                  ) : (
                    u.email
                  )}
                </td>
                <td className="role-cell">{u.role || 'user'}</td>
                <td className="actions-col">
                  {editingId === u.id ? (
                    <>
                      <button type="button" className="btn-save" onClick={() => saveEdit(u.id)} disabled={loading}>
                        Save
                      </button>
                      <button type="button" className="btn-cancel" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn-edit" onClick={() => startEdit(u)}>Edit</button>
                      <button type="button" className="btn-toggle" onClick={() => toggleAdmin(u)}>
                        {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManage;
