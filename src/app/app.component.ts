import { Todo } from './todo';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'day3workshop';
  form: FormGroup;
  tomorrow = new Date();
  todoValues: Todo[] = [];
  PRIORITIES = ['Low', 'Medium', 'High'];
  isAdd = true;
  index!: number;

  constructor(private fb: FormBuilder) {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.form = this.fb.group({
      task: this.fb.control('', [Validators.required]),
      priority: this.fb.control('', [Validators.required]),
      dueDate: this.fb.control('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.loadLocalStorage();
  }

  addTodo() {
    console.log('add todo');
    let singleTodo: Todo = {
      task: this.form.value.task,
      priority: this.form.value.priority,
      dueDate: this.form.value.dueDate,
      status: false,
      taskId: uuidv4(),
    };

    this.todoValues.push(singleTodo);
    this.form.reset();
    localStorage.setItem(singleTodo.taskId, JSON.stringify(singleTodo));
  }

  editTodo(index: number) {
    console.log('edit todo');
    let singleTodoEdit = this.todoValues[index];
    this.form.setValue({
      task: singleTodoEdit.task,
      priority: singleTodoEdit.priority,
      dueDate: singleTodoEdit.dueDate,
    });

    console.log(singleTodoEdit);
    this.index = index;
    this.isAdd = false;
  }

  updateTodo() {
    console.log('update todo');
    let singleTodoUpdate = this.todoValues[this.index];
    singleTodoUpdate.dueDate = this.form.value.dueDate;
    singleTodoUpdate.priority = this.form.value.priority;
    singleTodoUpdate.task = this.form.value.task;

    localStorage.setItem(
      singleTodoUpdate.taskId,
      JSON.stringify(singleTodoUpdate)
    );
    this.form.reset();
    this.isAdd = true;
  }

  deleteTodo(index: number) {
    console.log('delete todo');
    let singleTodoDelete = this.todoValues[index];
    localStorage.removeItem(singleTodoDelete.taskId);
    this.todoValues.splice(index, 1);
  }

  saveDone(todo: Todo) {
    console.log('saving todo to database on status change');
    localStorage.setItem(todo.taskId, JSON.stringify(todo));
  }

  loadLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const taskId = localStorage.key(i) as string;
      const task: Todo = JSON.parse(localStorage.getItem(taskId) as string);
      this.todoValues.push(task);
    }
  }
}
