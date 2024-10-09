import React, { useState, useEffect } from "react";

//create your first component
const TodoList = () => {
  const [todos, setTodos] = useState([
    "Make the bed",
    "Wash the cars",
    "Start coding",
    "Take my dog to get a grooming",
  ]);
  const [newTodo, setNewTodo] = useState("");
  const API_URL = "https://playground.4geeks.com/todo/users/Joaquin95";

  //API

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setTodos([]);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      const updatedTodos = [...todos, { label: newTodo, done: false }];
      setTodos(updatedTodos);
      setNewTodo("");

      await fetch(API_URL, {
        method: "PUT",
        body: JSON.stringify(updatedTodos),
        headers: { "Content-Type": "application/json" },
      });
    }
  };

  const removeTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);

    await fetch(API_URL, {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: { "Content-Type": "application/json" },
    });
  };

  const clearTodos = async () => {
    setTodos([]);
    await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">todos</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
        />
      </form>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            {todo}
            <button onClick={() => removeTodo(index)} className="delete-button">
              ✖
            </button>
          </li>
        ))}
      </ul>
      <div className="todo-footer">
        {todos.length} {todos.length === 1 ? "item" : "items"} left
      </div>
    </div>
  );
};
export default TodoList;
