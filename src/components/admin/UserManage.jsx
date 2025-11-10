import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import API_URL from '../../config/api';
import './UserManage.css';

function UserManage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // ID for which PATCH was not supported by the server and a full PUT is required
  const [patchUnsupportedId, setPatchUnsupportedId] = useState(null);

  // handle input changes for the edit form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    setForm({
      username: u.username || (u.email ? u.email.split('@')[0] : ''),
      email: u.email || '',
      password: '' // optional; send only if admin fills it
    });

    // ensure UI has time to render before focusing
    setTimeout(() => {
      const pwd = document.querySelector(`form.user-edit-form[data-user-id="${u.id}"] input[name="password"]`);
      if (pwd) pwd.focus();
    }, 50);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ username: '', email: '', password: '' });
  };

  // helper to remove empty values (so password is omitted when blank)
  const cleanPayload = (obj) => {
    const out = {};
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      if (v !== undefined && v !== null) {
        if (typeof v === 'string') {
          if (v.trim() !== '') out[k] = v;
        } else {
          out[k] = v;
        }
      }
    });
    return out;
  };

  const saveEdit = async (id) => {
    // client-side validation (username & email)
    if (!form.username || form.username.trim() === '') {
      alert('Username cannot be empty.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    // Build payload that includes username/email and password only if provided
    const rawPayload = {
      username: form.username,
      email: form.email,
      password: form.password
    };
    const payload = cleanPayload(rawPayload);

    if (Object.keys(payload).length === 0) {
      setEditingId(null);
      setForm({ username: '', email: '', password: '' });
      setLoading(false);
      return;
    }

    const requestJson = async (method, extraHeaders = {}, body = payload) => {
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
      // Primary: PATCH (partial update keeps password unchanged when omitted)
      let res = await requestJson('PATCH');

      // If PATCH not implemented (501) or method not allowed (405), do NOT auto-PUT.
      // Instead, open the editor and show an explicit "Force PUT" option so admin can provide password and confirm.
      if (!res.ok && (res.status === 501 || res.status === 405)) {
        // Mark this user as requiring full update and open edit form so admin can add password.
        setPatchUnsupportedId(id);
        startEdit(users.find(u => u.id === id) || { id });
        alert('Server does not support PATCH. To update this user perform a full update (PUT). Please provide a password (if required) and click "Save (Force PUT)".');
        return;
      }

      // If PUT/PATCH returned 400 validation error, surface it and if password is required prompt admin to fill it
      if (res && res.status === 400) {
        let errJson = null;
        try { errJson = await res.json(); } catch {/* ignore parsing errors */}
        if (errJson && errJson.password) {
          alert(`Password required by server: ${JSON.stringify(errJson.password)}. Please enter a password to proceed.`);
          startEdit(users.find(u => u.id === id) || { id });
          const pwdInput = document.querySelector(`form.user-edit-form[data-user-id="${id}"] input[name="password"]`);
          if (pwdInput) pwdInput.focus();
          return;
        }
        alert(`Validation error: ${JSON.stringify(errJson || 'Bad Request')}`);
        return;
      }

      if (res && res.ok) {
        await fetchUsers();
        setEditingId(null);
        setForm({ username: '', email: '', password: '' });
        setPatchUnsupportedId(null);
      } else {
        // Other non-ok responses
        let errMsg = `Error saving user${res ? ` (status ${res.status})` : ''}.`;
        try {
          const errJson = res ? await res.json() : null;
          if (errJson?.error) errMsg = errJson.error;
          else if (errJson?.message) errMsg = errJson.message;
          else if (errJson) errMsg = JSON.stringify(errJson);
        } catch {
          // Ignore JSON parsing errors, use fallback error message
        }
        alert(errMsg);
      }
    } catch {
      alert('Network error while saving user. Check server or CORS settings.');
    } finally {
      setLoading(false);
    }
  };

  // Explicit "Force PUT" flow: only attempted when admin provides a password and confirms.
  const saveEditForcePut = async (id) => {
    if (!form.password || form.password.trim() === '') {
      alert('Force PUT requires providing a password (server enforces full update). Enter a password then retry.');
      return;
    }
    const token = localStorage.getItem('token');
    setLoading(true);
    const rawPayload = { username: form.username, email: form.email, password: form.password };
    const payload = cleanPayload(rawPayload);
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res && res.ok) {
        await fetchUsers();
        setEditingId(null);
        setForm({ username: '', email: '', password: '' });
        setPatchUnsupportedId(null);
      } else if (res && res.status === 400) {
        let errJson = null;
        try { errJson = await res.json(); } catch {}
        alert(`Validation error: ${JSON.stringify(errJson || 'Bad Request')}`);
      } else {
        let errMsg = `Error (status ${res ? res.status : 'unknown'}) while forcing update.`;
        try {
          const errJson = res ? await res.json() : null;
          if (errJson?.error) errMsg = errJson.error;
          else if (errJson?.message) errMsg = errJson.message;
        } catch {}
        alert(errMsg);
      }
    } catch {
      alert('Network error while forcing PUT. Check server or CORS.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (u) => {
    if (!window.confirm(`Change admin status for ${u.email}?`)) return;
    const token = localStorage.getItem('token');
    setLoading(true);
    const newRole = u.role === 'admin' ? 'user' : 'admin';

    // include fields backend expects, omit empty password
    const rawPayload = {
      username: u.username || (u.email ? u.email.split('@')[0] : ''),
      email: u.email || '',
      role: newRole
    };
    const payload = cleanPayload(rawPayload);

    const requestJsonRole = async (method, extraHeaders = {}, body = payload) => {
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
      // Try PATCH first
      let res = await requestJsonRole('PATCH');

      // If PATCH is not supported, do not auto-PUT. Open editor and instruct admin to use Force PUT.
      if (!res.ok && (res.status === 501 || res.status === 405)) {
        setPatchUnsupportedId(u.id);
        startEdit(u);
        alert('Server does not support PATCH. To change role perform a full update (PUT). Provide a password (if required) and click "Save (Force PUT)".');
        return;
      }

      // If server requires password (400), open editor so admin can supply password
      if (res && res.status === 400) {
        let errJson = null;
        try { errJson = await res.json(); } catch {/* ignore parsing errors */}
        if (errJson && errJson.password) {
          alert(`Cannot change role: password required by server: ${JSON.stringify(errJson.password)}. Please edit the user and provide a password.`);
          startEdit(u);
          const pwdInput = document.querySelector(`form.user-edit-form[data-user-id="${u.id}"] input[name="password"]`);
          if (pwdInput) pwdInput.focus();
          return;
        }
        alert(`Validation error while changing role: ${JSON.stringify(errJson || 'Bad Request')}`);
        return;
      }

      if (res && res.ok) {
        setUsers((prev) => prev.map(p => p.id === u.id ? { ...p, role: newRole } : p));
      } else {
        let errMsg = `Error changing role${res ? ` (status ${res.status})` : ''}.`;
        try {
          const errJson = res ? await res.json() : null;
          if (errJson?.error) errMsg = errJson.error;
          else if (errJson?.message) errMsg = errJson.message;
        } catch {
          // Ignore JSON parsing errors, use fallback error message
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
              <th>Email / Username</th>
              <th>Role</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="4">No users found.</td></tr>
            )}
            {users.map((u) => (
              editingId === u.id ? (
                <tr key={u.id} className="editing-row">
                  <td colSpan="4">
                    <form
                      className="user-edit-form"
                      data-user-id={u.id}
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEdit(u.id);
                      }}
                    >
                      <div style={{display:'flex', gap: '0.75rem', alignItems:'flex-start', flexWrap:'wrap'}}>
                        <div style={{flex:'1 1 200px'}}>
                          <label style={{display:'block', fontWeight:600}}>Display</label>
                          <div style={{color:'#333'}}>{u.name || u.username || ''}</div>
                        </div>
                        <div style={{flex:'1 1 240px'}}>
                          <label style={{display:'block', fontWeight:600}}>Username</label>
                          <input name="username" value={form.username} onChange={handleChange} />
                          <label style={{display:'block', fontWeight:600, marginTop:'6px'}}>Email</label>
                          <input name="email" value={form.email} onChange={handleChange} />
                          <label style={{display:'block', fontWeight:600, marginTop:'6px'}}>Password (optional)</label>
                          <input name="password" value={form.password} onChange={handleChange} placeholder="leave blank to keep existing" type="password" />
                        </div>
                        <div style={{flex:'0 0 220px', textAlign:'right', display:'flex', flexDirection:'column', gap:'8px'}}>
                          <button type="submit" className="btn-save" disabled={loading}>Save</button>
                          <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                          <button type="button" className="btn-toggle" onClick={() => toggleAdmin(u)}>
                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </div>
                      </div>
                      {/* Add this button block near Save/Cancel in the form */}
                      { patchUnsupportedId === u.id && (
                        <div style={{marginTop:'6px', color:'#b33'}}>
                          <div><strong>Server requires full update (PUT).</strong> Enter password and click below to force PUT.</div>
                          <button type="button" className="btn-force" onClick={() => saveEditForcePut(u.id)} disabled={loading}>
                            Save (Force PUT)
                          </button>
                        </div>
                      )}
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={u.id}>
                  <td>{u.name || u.username || ''}</td>
                  <td>{u.email}</td>
                  <td className="role-cell">{u.role || 'user'}</td>
                  <td className="actions-col">
                    <button type="button" className="btn-edit" onClick={() => startEdit(u)}>Edit</button>
                    <button type="button" className="btn-toggle" onClick={() => toggleAdmin(u)}>
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManage;
