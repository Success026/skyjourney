'use client'
import { useState, useRef, useEffect } from 'react'
import { searchAirports, getAirportDisplayName } from '../lib/airportData'

export default function AirportAutocomplete({ name, value, onChange, placeholder, required }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      setSuggestions(searchAirports(query));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [query]);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectAirport(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectAirport = (airport) => {
    const displayValue = getAirportDisplayName(airport);
    setQuery(displayValue);
    onChange({ target: { name, value: airport.code, display: displayValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={`${name}_display`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setSuggestions(searchAirports(query)) && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="input-field w-full"
        required={required}
        autoComplete="off"
      />
      
      {isOpen && suggestions.length > 0 && (
        <ul 
          ref={suggestionsRef} 
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
        >
          {suggestions.map((airport, index) => (
            <li
              key={airport.code}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                index === highlightedIndex ? 'bg-blue-100' : ''
              }`}
              onClick={() => selectAirport(airport)}
            >
              <div className="flex items-center">
                <span className="font-medium">{airport.city}</span>
                <span className="text-sm text-gray-500 ml-1">
                  {airport.country} ({airport.code})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Hidden input for form submission with code */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}