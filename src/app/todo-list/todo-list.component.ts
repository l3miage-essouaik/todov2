import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoItem, TodoList, TodolistService } from '../todolist.service';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

type FILTER = (item: TodoItem) => boolean;
interface STATE extends TodoList {
  readonly nbItemsLeft: number;
  readonly filter: FILTER;
  readonly filteredItems: readonly TodoItem[];
  readonly allDone: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  readonly obsState: Observable<STATE>;
  readonly fAll: FILTER = () => true;
  readonly fCompleted: FILTER = i => i.isDone;
  readonly fActive: FILTER = i => !i.isDone;
  readonly bsFilter = new BehaviorSubject<FILTER>(this.fAll);

  public newItemLabel = "";

  constructor(private tdls: TodolistService) {
    this.obsState = combineLatest([tdls.observable, this.bsFilter]).pipe(
      map( ([TDL, filter]) => ({
        ...TDL,
        nbItemsLeft: TDL.items.reduce( (nb, item) => item.isDone ? nb : nb + 1, 0),
        filter,
        filteredItems: TDL.items.filter( filter ),
        allDone: !TDL.items.find( it => !it.isDone)
      }) )
    );
  }

  appendNexItem(): void {
    this.tdls.create( this.newItemLabel );
    this.newItemLabel = "";
  }

  updateItems(items: readonly TodoItem[], update: Partial<TodoItem>): void {
    this.tdls.update(update, ...items);
  }

  delete(items: readonly TodoItem[]): void {
    this.tdls.delete(...items);
  }
}