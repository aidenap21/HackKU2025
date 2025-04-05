from movie_list import *
from letterboxdpy import list as lb_list

class ListMovieList(MovieList):
    def __init__(self, list_author, list_name, movies=None):
        super().__init__()
        # Find Letterboxd list
        try:
            self.list = lb_list.List(list_author, list_name)
        except:
            self.list = None
            print(f"No list found for list: {list_name} with author {list_author}")

        movie_set = set()

        # Add Letterboxd list to set
        if self.list is not None:
            for movie in self.list.movies:
                movie_set.add(movie[1])

        # Add manual list to set
        if movies is not None:
            movie_set.update(set(movies))

        self.movies = list(movie_set)
        self.movies.sort()