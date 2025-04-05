import random

class MovieList():
    def __init__(self):
        self.movies = []


    # Choose a given number of movies at random
    def reduce_movies(self, count):
        if count >= len(self.movies):
            print("Not enough movies to reduce")
            return self.movies
        
        return random.sample(self.movies, count)