import React, { useState } from "react";

//create your first component
const TodoList = () => {
  const [todos, setTodos] = useState([
    "Make the bed",
    "Wash the cars",
    "Start coding",
    "Take my dog to get a grooming",
  ]);
  const [newTodo, setNewTodo] = useState("");

  //Changed "addtodo" to "addtodolist" for line 69
  const addTodolist = (e) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((todo, i) => i !== index);
    setTodos(updatedTodos);
  };
  const [error, setError] = useState(null);
  const API_URL = "https://playground.4geeks.com/todo/docs#/";

  const fetchTodos = async () => {
    await fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        return response.json();
      })
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const syncTodosWithServer = () => {
    fetch(API_URL, {
      method: "PUT",
      body: JSON.stringify(todos),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((resp) => {
        console.log(resp.ok);
        console.log(resp.status);
        return resp.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    const newTask = {
      title: newTodo,
      completed: false,
    };

    await fetch('https://playground.4geeks.com/todo/users/Joaquin95-ToDoList-React_Fetch', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
        return response.json();
      })
      .then((addTodo) => {
        setTodos([...todos, addedTodo]);
        setNewTodo("");
        syncTodosWithServer();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const deleteTodo = async (id) => {
    await fetch("${API_URL}/${id}", {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
        setTodos(todos.filter((todo) => todo.id !== id));
        syncTodosWithServer();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (error) return <div>Error: {error}</div>;

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
        {todos.length} item{todos.length !== 1 ? "s" : ""} left
      </div>
    </div>
  );
};
export default TodoList;
