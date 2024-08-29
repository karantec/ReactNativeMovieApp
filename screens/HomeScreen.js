import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_KEY = 'd5c1b3ea93ae2811dc648aba6c84bfd7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 15; // Number of items per page

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if there are more movies to load

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      setHasMore(response.data.results.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (text) => {
    setQuery(text);
    setPage(1); // Reset to the first page
    if (text.length > 0) {
      try {
        const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${text}&page=${page}`);
        setMovies(response.data.results);
        setHasMore(response.data.results.length > 0);
      } catch (error) {
        console.error(error);
      }
    } else {
      fetchMovies();
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.info}>Release Date: {item.release_date}</Text>
        <Text style={styles.info}>Language: {item.original_language.toUpperCase()}</Text>
        <Text style={styles.info}>Popularity: {item.popularity.toFixed(1)}</Text>
        <Text style={styles.rating}>Rating: {item.vote_average}</Text>
        <Text style={styles.overview}>{item.overview}</Text>
        <Text style={styles.genre}>
          Genres: {item.genre_ids.join(', ')}
        </Text>
        <Text style={styles.adult}>
          Adult: {item.adult ? 'Yes' : 'No'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for movies..."
        value={query}
        onChangeText={searchMovies}
      />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Trigger load more when scrolled to 50% of the bottom
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  movieItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    alignItems: 'center',
  },
  poster: {
    width: (width / 3) - 20, // Adjust width for 3 columns with padding
    height: 150,
    borderRadius: 5,
  },
  detailsContainer: {
    padding: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
    color: 'gray',
  },
  rating: {
    fontSize: 14,
    color: 'green',
  },
  overview: {
    fontSize: 12,
    color: 'darkgray',
  },
  genre: {
    fontSize: 12,
    color: 'blue',
  },
  adult: {
    fontSize: 12,
    color: 'red',
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
