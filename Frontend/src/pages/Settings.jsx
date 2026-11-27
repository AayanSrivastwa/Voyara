import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Lock, AlertTriangle, Check } from 'lucide-react';
import { authService } from '../services/authService';

export default function Settings() {
  const navigate = useNavigate();

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdToast, setPwdToast] = useState('');

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState('');
  const [delLoading, setDelLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setPwdLoading(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      setPwdToast('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPwdToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (window.confirm('CAUTION: This will permanently erase your user account and all associated trips, itineraries, and expenses. Continue?')) {
      setDelLoading(true);
      try {
        await authService.deleteAccount(deletePassword);
        navigate('/register');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete account. Verify password.');
      } finally {
        setDelLoading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <SettingsIcon size={14} color="var(--color-sage)" /> Preferences & Security
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure security credentials, appearance, and account lifecycle.
        </p>
      </div>

      {pwdToast && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80', border: '1px solid rgba(74, 222, 128, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} />
          <span>{pwdToast}</span>
        </div>
      )}

      {/* Change Password Panel */}
      <form onSubmit={handlePasswordChange} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} color="var(--color-sage)" /> Change Password
        </h3>

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Current Password
          </label>
          <input
            type="password"
            className="glass-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            New Password (minimum 6 characters)
          </label>
          <input
            type="password"
            className="glass-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="glass-button primary" style={{ height: '42px', marginTop: '6px' }} disabled={pwdLoading}>
          {pwdLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {/* Danger Zone: Delete Account */}
      <div className="glass-panel" style={{ padding: '28px', borderColor: 'rgba(248, 113, 113, 0.4)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Deleting your account is permanent. All your planned trips, saved destinations, and expense logs will be permanently deleted.
        </p>

        <form onSubmit={handleDeleteAccount} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="password"
            className="glass-input"
            placeholder="Confirm password to delete"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            required
            style={{ flex: 1, minWidth: '220px' }}
          />
          <button
            type="submit"
            className="glass-button"
            style={{ background: 'rgba(248, 113, 113, 0.25)', borderColor: '#F87171', color: '#FFF' }}
            disabled={delLoading}
          >
            {delLoading ? 'Erasing...' : 'Delete Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
