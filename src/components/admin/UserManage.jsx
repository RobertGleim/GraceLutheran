import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import API_URL from '../../config/api';
import './UserManage.css';

function UserManage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // handlers for "press-and-hold" show-password toggle (mouse/touch/keyboard)
  const holdShowStart = (e) => {
    if (e && e.type === 'touchstart') e.preventDefault();
    setShowPassword(true);
  };
  const holdShowEnd = () => setShowPassword(false);
  
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

    // ensure password hidden when opening editor
    setShowPassword(false);
    // ensure we're not already in "editing password" mode
    setEditingPassword(false);

    // ensure UI has time to render before focusing
    setTimeout(() => {
      const pwd = document.querySelector(`form.user-edit-form[data-user-id="${u.id}"] input[name="password"]`);
      if (pwd) pwd.focus();
    }, 50);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ username: '', email: '', password: '' });
    setShowPassword(false);
    setEditingPassword(false);
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
      // use PUT (backend expects PUT; it will accept partial fields and ignore missing password)
      let res = await requestJson('PUT');

      // Handle validation errors (400) and other responses
      if (res && res.status === 400) {
        let errJson = null;
        try { errJson = await res.json(); } catch {/* ignore parsing errors */}
        if (errJson && errJson.password) {
          alert(`Password required by server: ${JSON.stringify(errJson.password)}. Please enter a password to proceed.`);
          // keep the editor open for admin to provide password
          return;
        }
        alert(`Validation error: ${JSON.stringify(errJson || 'Bad Request')}`);
        return;
      }

      if (res && res.ok) {
        await fetchUsers();
        setEditingId(null);
        setForm({ username: '', email: '', password: '' });
        setShowPassword(false);
        setEditingPassword(false);
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
      // use PUT (server expects PUT)
      let res = await requestJsonRole('PUT');

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

  // new: delete user
  const deleteUser = async (u) => {
    if (!window.confirm(`Delete user ${u.email}? This action cannot be undone.`)) return;
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/${u.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (res && res.ok) {
        // remove user locally
        setUsers((prev) => prev.filter(p => p.id !== u.id));
        // if currently editing the deleted user, close editor
        if (editingId === u.id) {
          setEditingId(null);
          setForm({ username: '', email: '', password: '' });
          setShowPassword(false);
        }
      } else {
        let errMsg = `Error deleting user${res ? ` (status ${res.status})` : ''}.`;
        try {
          const errJson = res ? await res.json() : null;
          if (errJson?.error) errMsg = errJson.error;
          else if (errJson?.message) errMsg = errJson.message;
        } catch {
          // ignore JSON parsing errors
        }
        alert(errMsg);
      }
    } catch {
      alert('Network error while deleting user. Check server/CORS.');
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
                      {/* grid aligns to table columns: Name | Email/Username | Role | Actions */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 220px',
                        gap: '0.75rem',
                        alignItems: 'start'
                      }}>
                        <div style={{ gridColumn: '1' }}>
                          <label style={{display:'block', fontWeight:600}}>Display</label>
                          <div style={{color:'#333'}}>{u.name || u.username || ''}</div>
                        </div>

                        <div style={{ gridColumn: '2' }}>
                          <label style={{display:'block', fontWeight:600}}>Username</label>
                          <input name="username" value={form.username} onChange={handleChange} />
                          <label style={{display:'block', fontWeight:600, marginTop:'6px'}}>Email</label>
                          <input name="email" value={form.email} onChange={handleChange} />
                          <label style={{display:'block', fontWeight:600, marginTop:'6px'}}>Password</label>

                          {/* If admin hasn't opted to edit password, show a masked placeholder.
                              Clicking the small edit icon replaces the mask with an editable password input.
                              We DO NOT reveal the real password (not possible/safe). */}
                          {!editingPassword ? (
                            <div className="password-wrap-inline">
                              <input name="password_display" value="********" readOnly />
                              <button
                                type="button"
                                className="pw-toggle pw-edit"
                                aria-label="Edit password"
                                onClick={() => setEditingPassword(true)}
                              >✎</button>
                            </div>
                          ) : (
                            <div className="password-wrap-inline">
                              <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="leave blank to keep existing"
                                type={showPassword ? 'text' : 'password'}
                              />
                              <button
                                type="button"
                                className="pw-toggle"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onMouseDown={holdShowStart}
                                onMouseUp={holdShowEnd}
                                onMouseLeave={holdShowEnd}
                                onTouchStart={holdShowStart}
                                onTouchEnd={holdShowEnd}
                                onKeyDown={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); setShowPassword(true) } }}
                                onKeyUp={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') setShowPassword(false) }}
                              >👁</button>
                            </div>
                          )}
                        </div>

                        <div style={{ gridColumn: '3' }}>
                          <label style={{display:'block', fontWeight:600}}>Role</label>
                          <div style={{color:'#333'}}>{u.role || 'user'}</div>
                        </div>

                        <div style={{ gridColumn: '4', textAlign: 'right', display:'flex', flexDirection:'column', gap:'8px' }}>
                          <button type="submit" className="btn-save" disabled={loading}>Save</button>
                          <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                          <button type="button" className="btn-toggle" onClick={() => toggleAdmin(u)}>
                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button type="button" className="btn-delete" onClick={() => deleteUser(u)} disabled={loading}>Delete</button>
                        </div>
                      </div>
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
