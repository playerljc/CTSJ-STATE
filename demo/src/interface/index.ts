import {TodoType} from "../enum/index";

export interface ITodo {
  id: string,
  value: string,
  type: TodoType,
}
