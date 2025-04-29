"use client";

import { deleteTodo, updateTodo } from "actions/todo-actions";
import {
  Checkbox,
  IconButton,
  Spinner,
} from "node_modules/@material-tailwind/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "config/reactQueryClientProvider";

export default function Todo({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);
  const [title, setTitle] = useState(todo.title);

  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title,
        completed,
      }),

    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div className="w-full flex items-center gap-2">
      <Checkbox
        checked={completed}
        onChange={async (e) => {
          setCompleted(e.target.checked);
          await updateTodoMutation.mutate();
        }}
      />

      {isEditing ? (
        <input
          className="flex-1 border-b-black border-b pb-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <p className={`flex-1 ${completed ? "line-through" : ""}`}>{title}</p>
      )}

      {isEditing ? (
        <IconButton
          onClick={async () => {
            await updateTodoMutation.mutate();
          }}
        >
          {updateTodoMutation.isPending ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <i className="fas fa-check" />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={() => setIsEditing(true)}>
          <i className="fas fa-pen" />
        </IconButton>
      )}

      <IconButton onClick={() => deleteTodoMutation.mutate()}>
        {deleteTodoMutation.isPending ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
