import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Trash2, Plus, ArrowRight } from 'lucide-react';
import { favouriteService } from '../services/favouriteService';
import { useWeather } from '../context/WeatherContext';

export default function SavedPlaces() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectDestination } = useWeather();
  const navigate = useNavigate();

  const loadFavourites = () => {
    setLoading(true);
    favouriteService.getFavourites()
      .then((data) => setFavourites(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  const handleRemove = async (id) => {
    try {
      await favouriteService.removeFavourite(id);
      setFavourites((prev) => prev.filter((f) => f._id !== id));
    } catch {}
  };

  const handleCreateTrip = (fav) => {
    navigate('/planner', {
      state: {
        prefilledDestination: {
          name: fav.destination,
          country: fav.country,
          coordinates: { lat: fav.latitude, lon: fav.longitude },
        },
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <Bookmark size={14} color="var(--color-sage)" /> Curated Collection
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          Saved Destinations
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Your personal wishlist of dream locations and bucket list coordinates.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading saved places...
        </div>
      ) : favourites.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Bookmark size={40} color="var(--color-sage)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
            No saved destinations yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            Explore our curated destinations across alpine peaks, tropical beaches, and historic cities to bookmark them.
          </p>
          <button className="glass-button primary" onClick={() => navigate('/explore')}>
            Discover Places
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favourites.map((fav) => (
            <div
              key={fav._id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'pointer',
              }}
              onClick={() => selectDestination(fav.destination)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-sage)', fontSize: '12px' }}>
                    <MapPin size={12} />
                    <span>{fav.country || 'Global'}</span>
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#FFF', marginTop: '2px' }}>
                    {fav.destination}
                  </h4>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(fav._id);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Remove from saved"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {fav.notes && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {fav.notes}
                </p>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Click to inspect weather
                </span>
                <button
                  className="glass-button primary"
                  style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateTrip(fav);
                  }}
                >
                  Plan Trip
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
