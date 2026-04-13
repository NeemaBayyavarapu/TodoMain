import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const getData = () => {
    const data = localStorage.getItem("todoData");
    return data
      ? JSON.parse(data)
      : { todos: [], history: [], redoStack: [] };
  };

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");

  const [todos, setTodos] = useState(() => getData().todos);
  const [history, setHistory] = useState(() => getData().history);
  const [redoStack, setRedoStack] = useState(() => getData().redoStack);

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "todoData",
      JSON.stringify({ todos, history, redoStack })
    );
  }, [todos, history, redoStack]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const updateState = (newTodos) => {
    setHistory((prev) => [...prev, todos]);
    setTodos(newTodos);
    setRedoStack([]);
  };

  const addTask = () => {
    if (!task.trim()) {
      showToast("Enter something!");
      return;
    }
    updateState([
      ...todos,
      { text: task, completed: false, category }
    ]);
    setTask("");
  };

  const deleteTask = (index) => {
    updateState(todos.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    const updated = todos.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    updateState(updated);
  };

  const editTask = (index) => {
    const newText = prompt("Edit task:");
    if (!newText) return;
    const updated = [...todos];
    updated[index].text = newText;
    updateState(updated);
  };

  const undo = () => {
    if (!history.length) {
      showToast("Nothing to undo");
      return;
    }
    const prev = history[history.length - 1];
    setRedoStack((r) => [todos, ...r]);
    setTodos(prev);
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (!redoStack.length) {
      showToast("Nothing to redo");
      return;
    }
    const next = redoStack[0];
    setHistory((h) => [...h, todos]);
    setTodos(next);
    setRedoStack((r) => r.slice(1));
  };

  return (
    <div className="app">
      <div className="wrapper">

        {/* INPUT */}
        <div className="input-container">
          <h2>Add Task</h2>

          <div className="input-box">
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task..."
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>General</option>
              <option>Study</option>
              <option>Work</option>
              <option>Personal</option>
            </select>

            <button onClick={addTask}>Add</button>
          </div>
        </div>

        {/* TODO LIST */}
        <div className="todo-container">
          <div className="todo-header">
            <h2>Your Tasks</h2>

            <div className="actions">
              <button onClick={undo}>Undo</button>
              <button onClick={redo}>Redo</button>
            </div>
          </div>

          <ul>
            {todos.length === 0 ? (
              <p className="empty">No data present</p>
            ) : (
              todos.map((t, index) => (
                <li key={index} className="todo">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(index)}
                  />

                  <div className="text-box">
  <span className={`main-text ${t.completed ? "done" : ""}`}>
    {t.text}
  </span>
  <span className="category">{t.category}</span>
</div>

                  <div className="btns">
                    <button onClick={() => editTask(index)}>✏️</button>
                    <button onClick={() => deleteTask(index)}>❌</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

export default App;