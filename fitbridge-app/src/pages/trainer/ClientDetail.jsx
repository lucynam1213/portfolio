import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBar from '../../components/StatusBar';
import TrainerNav from '../../components/TrainerNav';

const tabs = ['Overview', 'Workouts', 'Nutrition', 'Body'];

const clientWorkouts = {
  usr_001: ['Upper Body Strength', 'Core Stability', 'HIIT Cardio Blast'],
  usr_003: ['Morning Yoga Flow', 'Leg Day Fundamentals'],
  usr_004: ['Core Stability'],
  usr_005: ['Upper Body Strength'],
  usr_006: ['Morning Yoga Flow'],
  usr_007: ['Core Stability', 'Upper Body Strength', 'HIIT Cardio Blast'],
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [toast, setToast] = useState('');

  const client = clients.find((c) => c.id === id) || clients[0];
  const workouts = clientWorkouts[client?.id] || [];

  function saveNote() {
    if (!note.trim()) return;
    setSavedNote(note);
    setNote('');
    setToast('Note saved!');
    setTimeout(() => setToast(''), 2500);
  }

  if (!client) return null;

  return (
    <div style={{ width: '100%', height: '100%', background: '#F7F8FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff' }}>
        <StatusBar theme="light" />
        <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="avatar avatar-lg" style={{
            background: client.status === 'at-risk' ? '#FEF2F2' : '#ECFDF5',
            color: client.status === 'at-risk' ? '#EF4444' : '#00C87A',
          }}>
            {client.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 2 }}>{client.name}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`chip ${client.status === 'at-risk' ? 'chip-red' : client.status === 'inactive' ? 'chip-gray' : 'chip-green'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                {client.status === 'at-risk' ? 'At Risk' : client.status === 'inactive' ? 'Inactive' : 'Active'}
              </span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{client.sessions} sessions</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 4 }}>
          {tabs.map((t) => (
            <button
              key={t}
              className={`tab${activeTab === t ? ' active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="phone-content">
        {activeTab === 'Overview' && (
          <div style={{ padding: '16px 20px' }}>
            {/* Quick stats */}
            <div className="grid-3" style={{ marginBottom: 16 }}>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <span className="stat-label">Sessions</span>
                <span className="stat-value">{client.sessions}</span>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <span className="stat-label">Last Active</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{client.lastActive}</span>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <span className="stat-label">Workouts</span>
                <span className="stat-value">{workouts.length}</span>
              </div>
            </div>

            {/* Weight trend placeholder */}
            <div className="section-header">
              <span className="section-title">Weight Trend</span>
            </div>
            <div style={{
              width: '100%',
              height: 120,
              background: '#fff',
              border: '1px solid #E8ECF2',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '12px 20px', width: '100%' }}>
                {[80, 65, 75, 85, 70, 90, 72].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: h * 0.7, background: i === 6 ? '#00C87A' : '#E8ECF2', borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
            </div>

            {/* Recent workouts */}
            <div className="section-header">
              <span className="section-title">Recent Workouts</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {workouts.slice(0, 3).map((w, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{i === 0 ? '🏋️' : i === 1 ? '🧘' : '🏃'}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{w}</p>
                    <p style={{ fontSize: 12, color: '#6B7280' }}>{i === 0 ? 'Today' : i === 1 ? 'Yesterday' : '3 days ago'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/trainer/programs/assign')}>
                Assign Workout
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate(`/user/messages`)}>
                Message
              </button>
            </div>

            {/* Trainer note */}
            <div className="section-header">
              <span className="section-title">Trainer Note</span>
            </div>
            {savedNote && (
              <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.5 }}>{savedNote}</p>
              </div>
            )}
            <textarea
              className="input textarea"
              placeholder={`Add a note for ${client.name.split(' ')[0]}...`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <button className="btn btn-primary btn-full" onClick={saveNote} disabled={!note.trim()}>
              Save Note
            </button>
          </div>
        )}

        {activeTab === 'Workouts' && (
          <div style={{ padding: '16px 20px' }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <span className="section-title">Assigned Workouts</span>
              <button className="see-all" onClick={() => navigate('/trainer/programs/assign')}>Assign +</button>
            </div>
            {workouts.map((w, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  🏋️
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{w}</p>
                  <p style={{ fontSize: 12, color: '#6B7280' }}>Assigned {i === 0 ? 'today' : `${i + 1} days ago`}</p>
                </div>
                <span className="chip chip-green" style={{ fontSize: 11 }}>Active</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Nutrition' && (
          <div style={{ padding: '16px 20px' }}>
            <div className="grid-3" style={{ marginBottom: 16 }}>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <span className="stat-label">Calories</span>
                <span className="stat-value">1,840</span>
                <span className="stat-sub">avg/day</span>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <span className="stat-label">Protein</span>
                <span className="stat-value">147g</span>
                <span className="stat-sub">avg/day</span>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <span className="stat-label">Log Days</span>
                <span className="stat-value">18</span>
                <span className="stat-sub">this month</span>
              </div>
            </div>
            <div className="card" style={{ padding: '20px', textAlign: 'center', border: '2px dashed #E8ECF2' }}>
              <p style={{ fontSize: 14, color: '#6B7280' }}>Detailed nutrition data requires client permission</p>
            </div>
          </div>
        )}

        {activeTab === 'Body' && (
          <div style={{ padding: '16px 20px' }}>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <span className="stat-label">Current Weight</span>
                <span className="stat-value">182 lbs</span>
                <span style={{ fontSize: 12, color: '#00C87A', fontWeight: 600 }}>▼ 6 lbs this month</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Body Fat</span>
                <span className="stat-value">18%</span>
                <span style={{ fontSize: 12, color: '#00C87A', fontWeight: 600 }}>▼ 1.5% this month</span>
              </div>
            </div>
            <div className="card" style={{ padding: '20px', textAlign: 'center', border: '2px dashed #E8ECF2' }}>
              <p style={{ fontSize: 14, color: '#6B7280' }}>Full body composition chart coming soon</p>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast-container">
          <div className="toast toast-success">
            <span>✓</span> {toast}
          </div>
        </div>
      )}

      <TrainerNav />
    </div>
  );
}
