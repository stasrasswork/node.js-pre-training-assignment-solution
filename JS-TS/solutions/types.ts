export enum TodoStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
};
export interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    createdAt: Date;
};

export type NewTodo = {
  title: string;
  description?: string;
  status?: TodoStatus;
};

/*
**Requirements:**
1. Create an `enum` called `TodoStatus` with the following literal members: `PENDING`, `IN_PROGRESS`, `COMPLETED`.
2. Create an `interface` `Todo` with properties  
   - `id` (number) – unique identifier  
   - `title` (string) – short title  
   - `description` (string) – optional detailed text  
   - `status` (`TodoStatus`) – current status  
   - `createdAt` (Date) – creation timestamp (readonly)  
3. Create a type alias `NewTodo` that omits `id` and `createdAt` from `Todo`.
4. Export the types in `types.ts` (create the file if it does not exist).

**Example:**
```ts
const todo: Todo = {
  id: 42,
  title: 'Finish project',
  description: 'Refactor the data layer',
  status: TodoStatus.IN_PROGRESS,
  createdAt: new Date()
};
```
*/