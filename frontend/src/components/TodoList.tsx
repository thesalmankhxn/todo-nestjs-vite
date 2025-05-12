import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

const API_URL = import.meta.env.VITE_API_URL;

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      return response.json();
    },
  });

  const createTodo = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error("Failed to create todo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Todo> }) => {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    createTodo.mutate(newTodo.trim(), {
      onSuccess: () => setNewTodo(""),
    });
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1"
        />
        <Button type="submit" disabled={createTodo.isPending}>
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {todos.map((todo: Todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-2 bg-card rounded-lg"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) =>
                updateTodo.mutate({
                  id: todo.id,
                  data: { completed: checked as boolean },
                })
              }
            />
            <span
              className={`flex-1 ${
                todo.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {todo.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTodo.mutate(todo.id)}
              disabled={deleteTodo.isPending}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
