import React from 'react';
import './SearchResults.css';

function SearchResults({ results }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      <h3 className="results-title">תוצאות חיפוש ({results.length})</h3>
      <div className="results-grid">
        {results.map((item, index) => {
          const listing = item;
          
          // Use only the fields that exist in BoomNow API listings response
          // Based on actual API response structure
          const name = listing.title || listing.name;
          const address = listing.address;
          const city = listing.city;
          const country = listing.country;
          const rating = listing.rating;
          const price = listing.price;
          const currency = listing.currency;
          const description = listing.description;
          const amenities = listing.amenities;
          
          // Get all other fields that are not null/undefined and not already displayed
          const otherFields = Object.keys(listing).filter(key => {
            const value = listing[key];
            return value !== null && 
                   value !== undefined && 
                   !['title', 'name', 'address', 'city', 'country', 'rating', 
                     'price', 'currency', 'description', 'amenities', 'id', 'listing_id'].includes(key) &&
                   typeof value !== 'object';
          });

          return (
            <div key={listing.id || listing.listing_id || index} className="hotel-card">
              <div className="hotel-header">
                <h4 className="hotel-name">{name || 'מלון ללא שם'}</h4>
              </div>
              <div className="hotel-body">
                {address && (
                  <p className="hotel-address">
                    <span className="label">כתובת:</span> {address}
                  </p>
                )}
                {city && (
                  <p className="hotel-city">
                    <span className="label">עיר:</span> {city}
                  </p>
                )}
                {country && (
                  <p className="hotel-country">
                    <span className="label">מדינה:</span> {country}
                  </p>
                )}
                {rating && (
                  <p className="hotel-rating">
                    <span className="label">דירוג:</span> {rating} ⭐
                  </p>
                )}
                {price && (
                  <p className="hotel-price">
                    <span className="label">מחיר:</span> {price} {currency || 'ILS'}
                  </p>
                )}
                {description && (
                  <p className="hotel-description">
                    <span className="label">תיאור:</span> {description}
                  </p>
                )}
                {amenities && (
                  <div className="hotel-amenities">
                    <span className="label">שירותים:</span>
                    <div className="amenities-list">
                      {Array.isArray(amenities) ? (
                        amenities.map((amenity, i) => (
                          <span key={i} className="amenity-tag">
                            {typeof amenity === 'string' ? amenity : amenity.name || amenity}
                          </span>
                        ))
                      ) : (
                        <span className="amenity-tag">{String(amenities)}</span>
                      )}
                    </div>
                  </div>
                )}
                {/* Display other fields */}
                {otherFields.length > 0 && (
                  <div className="hotel-other-fields">
                    {otherFields.map((field) => (
                      <p key={field} className="hotel-field">
                        <span className="label">{field}:</span> {String(listing[field])}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="hotel-footer">
                <details>
                  <summary>פרטים מלאים (JSON)</summary>
                  <pre className="hotel-raw-data">
                    {JSON.stringify(listing, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResults;

