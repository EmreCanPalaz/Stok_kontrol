// Feedback.tsx için kod
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const Feedback: React.FC = () => {
  const { user, submitFeedback } = useAuth();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Lütfen bir yorum yazın.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await submitFeedback(rating, comment);
      setSuccess('Geri bildiriminiz için teşekkür ederiz!');
      setComment('');
      setRating(5);
    } catch (err: any) {
      console.error('Geri bildirim gönderme hatası:', err);
      setError('Geri bildirim gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Geri Bildirim</h2>
          <p>Geri bildirim göndermek için giriş yapmalısınız.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="auth-button"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Geri Bildirim</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="rating">Puanınız</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="comment">Yorumunuz</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deneyiminizi paylaşın..."
              required
              className="form-control"
              rows={5}
            />
          </div>
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Gönderiliyor...' : 'Geri Bildirim Gönder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;