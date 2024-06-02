import React, { useState } from 'react';
import { HStack, VStack, Text, IconButton, StackDivider, Spacer, Input, Button } from '@chakra-ui/react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

interface Todo {
  id: number;
  body: string;
}

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, body: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, deleteTodo, updateTodo }) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState<string>('');

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditBody(todo.body);
  };

  const handleUpdate = () => {
    if (editId !== null) {
      updateTodo(editId, editBody);
      setEditId(null);
      setEditBody('');
    }
  };

  return (
    <VStack
      divider={<StackDivider />}
      borderColor="gray.100"
      borderWidth="2px"
      borderRadius="lg"
      p="4"
      width="100%"
      maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
      alignItems="stretch"
    >
      {todos.length === 0 ? (
        <Text>No todos available</Text>
      ) : (
        todos.map((todo) => (
          <HStack key={todo.id}>
            {editId === todo.id ? (
              <>
                <Input
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <Button
                  leftIcon={<FaCheck />}
                  onClick={handleUpdate}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Text>{todo.body}</Text>
                <Spacer />
                <IconButton 
                  aria-label="Edit todo" 
                  icon={<FaEdit />} 
                  onClick={() => handleEdit(todo)} 
                />
                <IconButton 
                  aria-label="Delete todo" 
                  icon={<FaTrash />} 
                  onClick={() => deleteTodo(todo.id)} 
                />
              </>
            )}
          </HStack>
        ))
      )}
    </VStack>
  );
};

export default TodoList;
