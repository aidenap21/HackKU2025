from user_movie_list import *
from list_movie_list import *
from movie_list import *

class TotalMovieList(MovieList):
    def __init__(self, user_movie_lists=None, list_movie_list=None):
        super.__init__()
        # Save all users
        self.users = user_movie_lists

        movie_set = set()

        # Combine all user lists
        if user_movie_lists is not None:
            movie_set = set(self.users[0].movies)
            for user in self.users[1:]:
                movie_set.intersection_update(set(user.movies))

        # Combine list
        if list_movie_list is not None:
            if len(movie_set) == 0:
                movie_set = set(list_movie_list.movies)
            else:
                movie_set.intersection_update(list_movie_list.movies)

        self.movies = list(movie_set)
        self.movies.sort()
    

if __name__ == "__main__":
    aiden = UserMovieList(username="aidenap21")
    kai   = UserMovieList(username="BinklyTheFirst")
    neha  = UserMovieList(username="neha03")

    top_250 = ListMovieList("dave", "Official Top 250 Narrative Feature Films")

    user_list = [aiden, kai, neha]
    tml = TotalMovieList(user_movie_lists=user_list, list_movie_list=top_250)
    print(f"Length of Aiden's list: {len(aiden.movies)}")
    print(f"Length of Kai's list: {len(kai.movies)}")
    print(f"Length of Neha's list: {len(neha.movies)}")
    print(f"Length of Top 250 list: {len(top_250.movies)}")
    print(f"Length of combined list: {len(tml.movies)}")