export class ToDoDto {
    id!: number;
    title!: string;
    completed!: boolean;
}

export class CreateToDoDto {
    title!: string;
}

export class UpdateToDoDto {
    title?: string;
    completed?: boolean;
}