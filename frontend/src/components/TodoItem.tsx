import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md group">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />
      <span
        className={cn(
          "flex-1",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity"
      >
        Delete
      </button>
    </div>
  );
}
