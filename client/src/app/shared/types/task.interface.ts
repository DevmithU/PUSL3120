export interface TaskInterface {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  userId: string;
  hasCheck: boolean;
  checkStatus: boolean;

}
