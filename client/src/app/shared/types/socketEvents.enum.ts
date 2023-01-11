export enum SocketEventsEnum {
  boardsJoin = 'boards:join',
  boardsLeave = 'boards:leave',
  columnsCreate = 'columns:create',
  columnsCreateSuccess = 'columns:createSuccess',
  columnsCreateFailure = 'columns:createFailure',
  tasksCreate = 'tasks:create',
  tasksCreateSuccess = 'tasks:createSuccess',
  tasksCreateFailure = 'tasks:createFailure',
  tasksUpdate = 'tasks:update',
  tasksUpdateSuccess = 'tasks:updateSuccess',
  tasksUpdateFailure = 'tasks:updateFailure',
  boardsUpdate = 'boards:update',
  boardsUpdateSuccess = 'boards:updateSuccess',
  boardsUpdateFailure = 'boards:updateFailure',
  boardsDelete = 'boards:delete',
  boardsDeleteSuccess = 'boards:deleteSuccess',
  boardsDeleteFailure = 'boards:deleteFailure',
  columnsDelete = 'columns:delete',
  columnsDeleteSuccess = 'columns:deleteSuccess',
  columnsDeleteFailure = 'columns:deleteFailure',
  columnsUpdate = 'columns:update',
  columnsUpdateSuccess = 'columns:updateSuccess',
  columnsUpdateFailure = 'columns:updateFailure',
  tasksDelete = "tasks:delete",
  tasksDeleteSuccess = "tasks:deleteSuccess",
  tasksDeleteFailure = "tasks:deleteFailure",
}
