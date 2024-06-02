'use client';
import { Heading, VStack, IconButton, useColorMode } from '@chakra-ui/react';
import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Todo {
  id: number;
  body: string;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        console.error(error);
      } else if (data) {
        setTodos(data);
      }
    };

    fetchTodos();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, (payload) => {
        console.log('Change received!', payload);

        if (payload.eventType === 'INSERT' && payload.new) {
          setTodos((prevTodos) => [...prevTodos, payload.new as Todo]);
        }
        if (payload.eventType === 'DELETE' && payload.old) {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== (payload.old as Todo).id));
        }
        if (payload.eventType === 'UPDATE' && payload.new) {
          setTodos((prevTodos) => prevTodos.map((todo) => todo.id === (payload.new as Todo).id ? payload.new as Todo : todo));
        }
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addTodo = async (body: string) => {
    const { data, error } = await supabase.from('todos').insert([{ body }]).single();

    if (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error(error);
    }
  };

  const updateTodo = async (id: number, body: string) => {
    const { data, error } = await supabase.from('todos').update({ body }).eq('id', id);

    if (error) {
      console.error(error);
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack p={4}>
      <IconButton 
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} 
        aria-label="Toggle theme"
        alignSelf={'flex-end'}
        onClick={toggleColorMode}
      />

      <Heading mb="8" fontWeight="extrabold" size={'2xl'}>
        My To Do List
      </Heading>
      
      <AddTodo addTodo={addTodo} />

      <TodoList todos={todos} deleteTodo={deleteTodo} updateTodo={updateTodo} />
    </VStack>
  );
}
