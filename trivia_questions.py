import os
import ast
import time
import random
from api_keys import GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY
import google.generativeai as gemini
from letterboxdpy import movie as lb_movie
from supabase import create_client, Client

class TrviaQuestions():
    def __init__(self):
        gemini.configure(api_key=GEMINI_API_KEY)
        self._model=gemini.GenerativeModel("gemini-1.5-flash")
        self._supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


    # Extract the question tuples
    def _extract_parentheses(self, text):
        results = []
        inside_quotes = False
        quote_char = ''
        level = 0
        start = None

        for i, char in enumerate(text):
            if char in ('"', "'"):
                if inside_quotes and char == quote_char:
                    inside_quotes = False
                    quote_char = ''
                elif not inside_quotes:
                    inside_quotes = True
                    quote_char = char
            elif not inside_quotes:
                if char == '(':
                    if level == 0:
                        start = i
                    level += 1
                elif char == ')':
                    level -= 1
                    if level == 0 and start is not None:
                        results.append(text[start:i+1])
                        start = None
        return results


    # Generate questions with Gemini
    def generate_questions(self, movie_title):
        # Check if generation has completed
        not_generated = True
        sleep_length = 1

        # Keep attempting to generate till successful
        while(not_generated):
            try:
                response = self._model.generate_content(
                    f"Generate five multiple choice questions for the movie {movie_title} in the following format, with the categories of 'Plot (1)', 'Cast (2)', 'Crew (3)', 'Cinematography (4)', 'Behind the Scenes (5)':"
                    f"('Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Option Number', 'Category Number')"
                    f"Do not give any other output"
                    )
                not_generated = False

            except Exception as e:
                # Wait before regenerating and increase sleep time incase of repeat error
                if "You exceeded your current quota" in str(e) and sleep_length < 10:
                    print(f"ResourceExhausted occured, sleeping for {sleep_length} second then regenerating")
                    time.sleep(sleep_length)
                    sleep_length +=1

                else:
                    raise e
        
        # Convert output to list of tuples
        question_list = []
        
        for question in self._extract_parentheses(response.text):
            question_list.append(ast.literal_eval(question))

        # Add question to the database
        for question, o1, o2, o3, o4, answer, category in question_list:
            response = (
                self._supabase.table("Trivia Questions")
                .insert({"movie": movie_title,
                         "question": question,
                         "option_1": o1,
                         "option_2": o2,
                         "option_3": o3,
                         "option_4": o4,
                         "answer"  : int(answer),
                         "category": int(category)})
                .execute()
                )
            '''INSERT INTO DATABASE HERE'''

        # Don't need to return after database support is added
        return question_list


    # Manually add question to the database
    def add_question(self, movie, question, o1, o2, o3, o4, answer, category):
        try:
            movie_obj = lb_movie.Movie(movie)
        except:
            print(f"The film '{movie}' could not be found, the question will not be added")
            return

        if category is None:
            category = 0

        insertion_tuple = (movie_obj.title, question, o1, o2, o3, o4, answer, category)

        '''INSERT INTO DATABASE HERE'''


    # Retrieve questions from database
    def retrieve_questions(self, movies, categories=[]):
        if not categories:
            categories = [0, 1, 2, 3, 4, 5]
        
        question_list = []

        for movie in movies:
            category_choice = random.choice(categories)

            # Attempt to read from database
            response = (
                self._supabase.table("Trivia Questions")
                .select("*")
                .eq("movie", movie)
                .eq("category", f"{category_choice}")
                .gte("verified", 0)
                .execute()
                )
            
            # Generate new questions if necessary
            if len(response.data) == 0:
                self.generate_questions(movie)

                response = (
                    self._supabase.table("Trivia Questions")
                    .select("*")
                    .eq("movie", movie)
                    .eq("category", f"{category_choice}")
                    .gte("verified", 0)
                    .execute()
                    )

            response_list = list(response.data)
            question = random.choice(response_list)
            question_list.append((
                question["movie"],
                question["question"],
                question["option_1"],
                question["option_2"],
                question["option_3"],
                question["option_4"],
                question["answer"],
                question["category"]
            ))

        return question_list


if __name__ == "__main__":

    from user_movie_list import UserMovieList
    uml = UserMovieList(username="aidenap21")
    tq = TrviaQuestions()
    movies = uml.reduce_movies(5)

    for movie in movies:
        print(movie)

    for question in tq.retrieve_questions(movies):
        print(question)
        # for question in tq.generate_questions(movie):
        #     print(question)