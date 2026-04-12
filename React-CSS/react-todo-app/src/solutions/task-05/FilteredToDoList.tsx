import React, { useState } from 'react';
import { Todo } from '../../types';
import './FilteredToDoList.css';

/**
 * Task 5: FilteredToDoList Component
 * 
 * Theory: Derived State and Computed Values
 * 
 * In React, you often need to compute values based on your state. These are called "derived state"
 * or "computed values" and should be calculated during render rather than stored in state.
 * 
 * Why Use Derived State:
 * 1. Avoids state synchronization issues
 * 2. Reduces complexity by having a single source of truth
 * 3. Automatically updates when source data changes
 * 4. Prevents stale state bugs
 * 
 * Common Derived State Patterns:
 * 
 * Filtering:
 * - const activeTodos = todos.filter(todo => !todo.completed)
 * - const completedTodos = todos.filter(todo => todo.completed)
 * 
 * Searching:
 * - const filteredTodos = todos.filter(todo => 
 *     todo.title.toLowerCase().includes(searchTerm.toLowerCase())
 *   )
 * 
 * Sorting:
 * - const sortedTodos = [...todos].sort((a, b) => a.title.localeCompare(b.title))
 * 
 * Aggregations:
 * - const completedCount = todos.filter(todo => todo.completed).length
 * - const totalCount = todos.length
 * 
 * Multiple Filters:
 * - Use multiple filter conditions or combine them
 * - Consider using useMemo for expensive computations
 * 
 * Key Concepts:
 * - Calculate derived values during render
 * - Don't store computed values in state
 * - Use useMemo for expensive calculations
 * - Keep state minimal and derive the rest
 */
export const FilteredToDoList: React.FC = () => {
  // TODO: Implement the FilteredToDoList component
  // 
  // Requirements:
  // 1. Display a list of todos with add functionality
  // 2. Add filter buttons: "All", "Active", "Completed"
  // 3. Filter todos based on selected filter
  // 4. Use derived state for filtered results
  // 5. Add complete functionality for todos
  // 
  // Example implementation:
  // const [todos, setTodos] = useState<Todo[]>([]);
  // const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  // 
  // const filteredTodos = todos.filter(todo => {
  //   if (filter === 'active') return !todo.completed;
  //   if (filter === 'completed') return todo.completed;
  //   return true; // 'all' case
  // });

  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleComplete = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const title =inputValue.trim();
    if (!title) {
      return
    }

    setTodos(prev => [
      ...prev, {id: Date.now(), title, completed: false},
    ]);
    setInputValue('');
  };

  return (
    <div className="complete-todo-list">
      <form className="todo-form" onSubmit={handlerSubmit}>
        <input
          className="todo-input"
          type="text"
          placeholder='Add todo' 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button className="add-button" type="submit">Add</button>
      </form>
      <div className="filter-buttons">
        <button className="filter-button" onClick={() => setFilter('all')}>All</button>
        <button className="filter-button" onClick={() => setFilter('active')}>Active</button>
        <button className="filter-button" onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <div className={todo.completed ? 'todo-item completed' : 'todo-item not-completed'}>
              <span className="todo-item-title">{todo.title}</span>
              <span className="todo-item__status">{todo.completed ? 'completed' : 'not completed'}</span>
              <button className="complete-button" onClick={() => handleComplete(todo.id)}>Complete</button>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
}; 