import React, { useState } from 'react';
import { Todo } from '../../types';

/**
 * Task 10: AddToDoForm Component
 * 
 * Theory: Controlled Components and Form Handling
 * 
 * Controlled components are React components where the form data is handled by the component's state.
 * This gives you full control over the form's behavior and makes it easier to validate and process data.
 * 
 * Controlled vs Uncontrolled Components:
 * 
 * Controlled Components:
 * - Form data is stored in component state
 * - Value is set by state, onChange updates state
 * - Example: <input value={value} onChange={setValue} />
 * - Benefits: Full control, easy validation, predictable behavior
 * 
 * Uncontrolled Components:
 * - Form data is handled by the DOM
 * - Use refs to access form values
 * - Example: <input ref={inputRef} />
 * - Benefits: Less code, better performance for simple forms
 * 
 * Form Handling Best Practices:
 * 
 * 1. Prevent Default Behavior:
 *    - Use event.preventDefault() in onSubmit
 *    - Prevents page reload on form submission
 *    - Example: const handleSubmit = (e) => { e.preventDefault(); }
 * 
 * 2. Input Validation:
 *    - Validate on change or submit
 *    - Show error messages to users
 *    - Disable submit button if form is invalid
 * 
 * 3. Form State Management:
 *    - Track multiple form fields in state
 *    - Use object to store form data
 *    - Example: const [formData, setFormData] = useState({ title: '', description: '' })
 * 
 * 4. Form Submission:
 *    - Handle submission in onSubmit handler
 *    - Process form data
 *    - Clear form after successful submission
 * 
 * Common Form Patterns:
 * 
 * 1. Single Input:
 *    - Track single value in state
 *    - Simple and straightforward
 * 
 * 2. Multiple Inputs:
 *    - Use object to store all form data
 *    - Update specific fields with spread operator
 *    - Example: setFormData({...formData, title: value})
 * 
 * 3. Dynamic Forms:
 *    - Add/remove form fields dynamically
 *    - Use arrays to store multiple items
 * 
 * 4. Form Validation:
 *    - Track validation state separately
 *    - Show/hide error messages
 *    - Disable submit when invalid
 * 
 * Key Concepts:
 * - Use controlled components for complex forms
 * - Always prevent default form submission
 * - Validate input data
 * - Provide user feedback for errors
 * - Clear form after successful submission
 */
export const AddToDoForm: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const title = inputValue.trim();
    if (!title) {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTodos(prev => [...prev, newTodo]);
    setInputValue('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
};