import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TodoItem } from '../todolist.service';

@Component({
  selector: 'app-todo-item[data]',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @ViewChild("newTextInput") newTextInput!: ElementRef<HTMLInputElement>;

  @Input() data!: TodoItem;
  @Output() update = new EventEmitter<Partial<TodoItem>>();
  @Output() delete = new EventEmitter<TodoItem>();

  private _editing = false;
  get editing(): boolean {return this._editing;}
  set editing(e: boolean) {
    this._editing = e;
    requestAnimationFrame(
      () => this.newTextInput.nativeElement.focus()
    )
  }
}