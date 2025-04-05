import random
from user_movie_list import *

class TotalMovieList:
    def __init__(self, user_movie_lists):
        # Save all users
        self.users = user_movie_lists

        # Combine all user lists
        movie_set = set(self.users[0].movies)
        for user in self.users[1:]:
            movie_set.intersection_update(set(user.movies))

        self.movies = list(movie_set)
        self.movies.sort()
    

    # Choose a given number of movies at random
    def reduce_movies(self, count):
        return random.sample(self.movies, count)
    

if __name__ == "__main__":
    aiden = UserMovieList(username="aidenap21")
    kai   = UserMovieList(username="BinklyTheFirst")
    neha  = UserMovieList(username="neha03")

    user_list = [aiden, kai, neha]
    tml = TotalMovieList(user_list)
    print(f"Length of Aiden's list: {len(aiden.movies)}")
    print(f"Length of Kai's list: {len(kai.movies)}")
    print(f"Length of Neha's list: {len(neha.movies)}")
    print(f"Length of combined list: {len(tml.movies)}")