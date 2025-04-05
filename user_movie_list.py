from movie_list import*
from letterboxdpy import user  as lb_user
from letterboxdpy import movie as lb_movie

class UserMovieList(MovieList):
    def __init__(self, username=None, movies=None):
        super().__init__()
        # Find Letterboxd user
        try:
            self.user = lb_user.User(username)
        except:
            self.user = None
            print(f"No user found for the username '{username}'")

        # Add manually added movies to movie set
        movie_set = set()
        if movies is not None:
            for movie in set(movies):
                try:
                    movie_obj = lb_movie.Movie(movie)
                except:
                    print(f"The film '{movie}' could not be found")
                    continue
                
                movie_set.add(movie_obj.title)

        # Iterate through user's watched movies and add to movie set
        if self.user is not None:
            for movie in lb_user.user_films_watched(self.user):
                movie_set.add(movie[1])

        self.movies = list(movie_set)
        self.movies.sort()


if __name__ == "__main__":
    extra_movies = ["Midsommar", "Black Swan", "Shutter Island", "sdfsfgda", "Django Unchained"]
    uml = UserMovieList(username="aidenap21", movies=extra_movies)
    reduced = uml.reduce_movies(10)
    for i in reduced:
        print(i)
    
        

        
    