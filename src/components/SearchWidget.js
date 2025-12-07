import React from 'react';
import './SearchWidget.css';

function SearchWidget({ location, adults, loading, error, onLocationChange, onAdultsChange, onSearch }) {
  return (
    <div className="search-container">
      <div className="search-widget">
        <h2 className="widget-title">חפש מלון</h2>
        <form onSubmit={onSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="location">מיקום</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="הזן עיר או מיקום (נסה באנגלית: London, Paris, Tel Aviv)"
              className="form-input"
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              💡 טיפ: נסה עם שמות ערים באנגלית לקבלת תוצאות טובות יותר
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="adults">מספר מבוגרים</label>
            <select
              id="adults"
              value={adults}
              onChange={(e) => onAdultsChange(e.target.value)}
              className="form-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'מחפש...' : 'חפש'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error.split('\n').map((line, i) => (
              <div key={i} style={{ marginBottom: i < error.split('\n').length - 1 ? '8px' : '0' }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchWidget;

