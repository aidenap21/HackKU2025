from user_movie_list import *
from total_movie_list import *
from trivia_questions import *

if __name__ == "__main__":
    user1 = input("Enter the first Letterboxd username: ")
    user2 = input("Enter the second Letterboxd username: ")
    quantity = input("Enter the number of questions to create: ")
    categories = input("Enter the categories you want or 0 if you want all.\nPlot (1), Cast (2), Crew (3), Cinematography (4), Behind the Scenes (5)\nChoices: ")

    if categories:
        categories = categories.split()
        for i in range(len(categories)):
            categories[i] = int(categories[i])
        if 0 in categories:
            categories = []

    user1_ml = UserMovieList(username=user1)
    user2_ml = UserMovieList(username=user2)
    
    total = TotalMovieList([user1_ml, user2_ml])
    movies = total.movies
    print(f"Overlapping movies: {len(total.movies)}")
    if len(total.movies) > int(quantity):
        movies = total.reduce_movies(int(quantity))

    trivia = TriviaQuestions()
    questions = trivia.retrieve_questions(movies, categories=categories)
    print(f"Number of questions: {len(questions)}")

    for movie, question, o1, o2, o3, o4, answer, category in questions:
        print(f"Movie: {movie}")
        print(f"Q: {question}")
        print(f"1: {o1}")
        print(f"2: {o2}")
        print(f"3: {o3}")
        print(f"4: {o4}")
        response = input("Answer: ")
        if int(response) == answer:
            print("Correct!")
        else:
            print(f"Incorrect! The correct answer is {answer}")
        verify = input("Is this question correct? 0 for No, 1 for Yes, 2 for IDK: ")
        if int(verify) != 2:
            trivia.verify_question(movie, question, int(verify))
