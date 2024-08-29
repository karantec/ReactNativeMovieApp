import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const API_KEY = 'd5c1b3ea93ae2811dc648aba6c84bfd7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images

const MovieDetailScreen = ({ route }) => {
  const { movieId } = route.params; // Get the movie ID from navigation params
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
      setMovie(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.info}>Release Date: {movie.release_date}</Text>
      <Text style={styles.info}>Language: {movie.original_language.toUpperCase()}</Text>
      <Text style={styles.info}>Popularity: {movie.popularity.toFixed(1)}</Text>
      <Text style={styles.rating}>Rating: {movie.vote_average}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text style={styles.genre}>
        Genres: {movie.genres.map(genre => genre.name).join(', ')}
      </Text>
      <Text style={styles.adult}>
        Adult: {movie.adult ? 'Yes' : 'No'}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  info: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 2,
  },
  rating: {
    fontSize: 16,
    color: 'green',
    marginVertical: 5,
  },
  overview: {
    fontSize: 14,
    color: 'darkgray',
    marginVertical: 5,
  },
  genre: {
    fontSize: 14,
    color: 'blue',
    marginVertical: 5,
  },
  adult: {
    fontSize: 14,
    color: 'red',
    marginVertical: 5,
  },
});

export default MovieDetailScreen;
