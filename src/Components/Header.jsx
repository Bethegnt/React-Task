import React, { useState } from 'react';

const Header = () => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        const names = search.split(',').map(name => name.trim());
        if (names.length === 0 || names.some(name => name === '')) {
            setError('Please enter at least one name.');
            return;
        }

        try {
            const results = [];
            for (const name of names) {
                const response = await fetch(`https://api.nationalize.io?name=${name}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for ${name}`);
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }
                const result = {
                    name: name,
                    predictions: data.country.map(country => ({
                        probability: country.probability,
                        country: country.country_id
                    }))
                };
                results.push(result);
            }
            setSearchResults(results);
            setError('');
        } catch (error) {
            console.error(error);
            setSearchResults([]);
            setError(error.message);
        }
    };

    return (
        <>
            <header>
                <div><p className='Brand-name'>React-Task</p></div>
                <div className='search-input'>
                    <input
                        type="text"
                        placeholder='Enter one or more names separated by commas'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className='search-button' onClick={handleSearch}>Search</button>
                </div>
                {error && <div>{error}</div>}
            </header>
            <div className="hero-section">
                {searchResults.length > 0 && (
                    <div>
                        <h2>Search Results:</h2>
                        {searchResults.map(result => (
                            <div key={result.name}>
                                <h3>Name: {result.name}</h3>
                                <ul>
                                    {result.predictions.map(prediction => (
                                        <li key={`${result.name}-${prediction.country}`}>
                                            Probability: {prediction.probability}, Country: {prediction.country}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default Header;
