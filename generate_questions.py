import re
import ast
import time
from gemini_key import GEMINI_API_KEY
import google.generativeai as gemini

class RetrieveQuestions():
    def __init__(self):
        gemini.configure(api_key=GEMINI_API_KEY)
        self.model=gemini.GenerativeModel("gemini-1.5-flash")


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
                response = self.model.generate_content(
                    f"Generate five multiple choice questions for the movie {movie_title} in the following format, with the categories of 'Plot (0)', 'Cast (1)', 'Crew (2)', 'Cinematography (3)', 'Behind the Scenes (4)':"
                    f"('Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Option Reprinted', 'Category Number')"
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

        return question_list


if __name__ == "__main__":
    from user_movie_list import UserMovieList
    uml = UserMovieList(username="aidenap21")
    rq = RetrieveQuestions()
    movies = uml.reduce_movies(5)

    for movie in movies:
        print(movie)
        for question in rq.generate_questions(movie):
            print(question)