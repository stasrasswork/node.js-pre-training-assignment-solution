import { Expose } from 'class-transformer';

export class TodoResponseDto {
  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  description?: string;

  @Expose()
  completed!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}