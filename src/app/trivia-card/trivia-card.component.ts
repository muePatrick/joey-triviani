import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'trivia-card',
  templateUrl: './trivia-card.component.html',
  styleUrls: ['./trivia-card.component.css', '../../../node_modules/bulma/css/bulma.css'] //''
})
export class TriviaCardComponent implements OnInit {

  opentdb_difficulty = "easy" // null, easy, medium, hard
  opentdb_categories: any = []
  opentdb_selected_categories: any = []
  opentdb_session_token: string = ""

  show_difficulty_menu = false
  show_category_menu = false

  question = {
    "category": "",
    "type": "multiple",
    "difficulty": "",
    "question": "-/-",
    "correct_answer": "-/-",
    "incorrect_answers": ["-/-", "-/-", "-/-"],
    "all_answers": ["-/-", "-/-", "-/-", "-/-"],
    "correct_answer_index": -1
  }

  showAnswer = false
  selectedAnswer = -1

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    let token:any = ""
    token = document.cookie?.split('; ')?.find(row => row.startsWith('token='))?.split('=')[1] || ""
    this.opentdb_session_token = token

    this.updateQuestion()
    this.getCategories().subscribe((data: any) => {
      this.opentdb_categories = [...data.trivia_categories]
      console.log(this.opentdb_categories)
    })
  }

  checkResult(i: any) {
    this.showAnswer = true
    this.selectedAnswer = i
  }

  changeDifficulty(difficulty: any) {
    this.opentdb_difficulty = difficulty
    this.show_difficulty_menu = false
  }

  toggleCategory(id: number) {
    let index = this.opentdb_selected_categories.indexOf(id)
    if (index >= 0) {
      this.opentdb_selected_categories.splice(index, 0)
    } else {
      this.opentdb_selected_categories = [...this.opentdb_selected_categories, id]
    }
  }

  updateQuestion() {
    this.getConfig().subscribe((data: any) => {
      if(data.response_code) {
        alert("Could not load question. If you enabled 'Force unique questions' you may have already exhausted all available questions. Try adding more categories or disable this setting.")
        return
      }

      let random_index = Math.floor(Math.random() * 4)
      let all_answers = [...data.results[0].incorrect_answers]
      all_answers.splice(random_index, 0, data.results[0].correct_answer)
      this.question = { ...data.results[0], all_answers: all_answers, correct_answer_index: random_index }
      this.showAnswer = false
      this.selectedAnswer = -1
      this.show_difficulty_menu = false
      this.show_category_menu = false

      
      let token:any = ""
      token = document.cookie?.split('; ')?.find(row => row.startsWith('token='))?.split('=')[1] || ""
      this.opentdb_session_token = token
      document.cookie = `token=${token};max-age=21600`;
    })
  }

  updateToken(event: any) {
    if (event.srcElement.checked) {
      this.getToken().subscribe((data: any) => {
        this.opentdb_session_token = data.token
        document.cookie = `token=${data.token};max-age=21600`;
      })
    } else {
      this.opentdb_session_token = ""
    }
  }

  getConfig() {
    // return this.http.get("https://opentdb.com/api.php?amount=1&category=15&difficulty=easy&type=multiple", {});
    // TODO use session token to not get duplicates (then also check error)

    let random_index = Math.floor(Math.random() * this.opentdb_selected_categories.length)


    let url = "https://opentdb.com/api.php?amount=1&type=multiple"
    url = url + (this.opentdb_difficulty ? `&difficulty=${this.opentdb_difficulty}` : '')
    url = url + (this.opentdb_selected_categories.length > 0 ? `&category=${this.opentdb_selected_categories[random_index]}` : '')
    url = url + (this.opentdb_session_token !== "" ? `&token=${this.opentdb_session_token}` : '')
    console.log(url)
    return this.http.get(url, {});
  }

  getCategories() {
    return this.http.get("https://opentdb.com/api_category.php", {});
  }

  getToken() {
    return this.http.get("https://opentdb.com/api_token.php?command=request", {});
  }

}
