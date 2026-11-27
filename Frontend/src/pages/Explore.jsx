import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus, Bookmark, Filter, Check } from 'lucide-react';
import { placesService } from '../services/placesService';
import { favouriteService } from '../services/favouriteService';
import DestinationCard from '../components/DestinationCard';
import { useWeather } from '../context/WeatherContext';

const CATEGORIES = ['All', 'Mountains', 'Beaches', 'Heritage', 'Adventure', 'Nature', 'City escapes'];

export default function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const { selectDestination } = useWeather();
  const navigate = useNavigate();

  // Load saved favourites
  useEffect(() => {
    favouriteService.getFavourites()
      .then((favs) => {
        setSavedIds(new Set(favs.map((f) => f.destination.toLowerCase())));
      })
      .catch(() => {});
  }, []);

  // Fetch destinations
  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      placesService.searchDestinations(searchQuery, activeCategory)
        .then((data) => setDestinations(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, activeCategory]);

  const handleSaveToggle = async (dest) => {
    const destKey = dest.name.toLowerCase();
    const isCurrentlySaved = savedIds.has(destKey);

    if (isCurrentlySaved) {
      // Find favourite and remove
      try {
        const favs = await favouriteService.getFavourites();
        const match = favs.find((f) => f.destination.toLowerCase() === destKey);
        if (match) {
          await favouriteService.removeFavourite(match._id);
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(destKey);
            return next;
          });
          showToast(`Removed ${dest.name} from saved`);
        }
      } catch {}
    } else {
      try {
        await favouriteService.addFavourite({
          destinationId: dest.id,
          destination: dest.name,
          country: dest.country,
          latitude: dest.coordinates?.lat,
          longitude: dest.coordinates?.lon,
        });
        setSavedIds((prev) => new Set(prev).add(destKey));
        showToast(`Saved ${dest.name} to favourites!`);
      } catch (err) {
        showToast('Already saved or failed to save.');
      }
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handlePlanTrip = (dest) => {
    navigate('/planner', { state: { prefilledDestination: dest } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast alert */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            background: 'rgba(8, 24, 34, 0.95)',
            border: '1px solid var(--glass-border)',
            color: '#FFF',
            padding: '12px 20px',
            borderRadius: '16px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color="#4ADE80" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Search */}
      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <MapPin size={14} color="var(--color-sage)" /> Destination Discovery
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          Explore the World
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Discover breathtaking landscapes, historic capitals, and alpine retreats tailored to current weather.
        </p>
      </div>

      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Search city, country, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px', height: '48px', borderRadius: '16px' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="glass-chip"
            style={{
              cursor: 'pointer',
              background: activeCategory === cat ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)',
              borderColor: activeCategory === cat ? '#FFF' : 'var(--glass-border)',
              color: '#FFF',
              fontWeight: activeCategory === cat ? 600 : 500,
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading destinations...
        </div>
      ) : destinations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
            No destinations found matching "{searchQuery}".
          </p>
          <button
            className="glass-button"
            style={{ marginTop: '16px' }}
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isSaved={savedIds.has(dest.name.toLowerCase())}
              onSave={handleSaveToggle}
              onCreateTrip={handlePlanTrip}
              onSelect={() => selectDestination(dest.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
