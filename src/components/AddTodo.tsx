import React, { useState } from 'react';
import { Button, HStack, Input } from '@chakra-ui/react';

interface AddTodoProps {
  addTodo: (body: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ addTodo }) => {
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(body);
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack>
        <Input 
          variant="filled" 
          placeholder="Input your plan here" 
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button colorScheme="cyan" type="submit">Add Todo</Button>
      </HStack>
    </form>
  );
};

export default AddTodo;
