import { User } from "../users/user";

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  user: User;
}
