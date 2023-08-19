import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchFromFirestore } from "utilities/firebaseUtils";
import Tweet from "./Tweet";


const SearchContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const location = useLocation()

    const handleSearch = async (queryTerm) => {
        const fetchedResults = await fetchFromFirestore('tweets', [['hashtags', 'array-contains', queryTerm]]);
        setResults(fetchedResults);
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search); // Replace history.location.search with location.search
        const tag = decodeURIComponent(params.get('tag'));
        
        if (tag) {
          setSearchTerm(tag);
          handleSearch(tag);
          console.log('SearchContent triggered', tag)
        }
      }, [location.search]);

  return (
    <div>
        {results.map(tweet => (
            <Tweet tweet={tweet} key={tweet.id} />
        ))}
    </div>
  )
}

export default SearchContent