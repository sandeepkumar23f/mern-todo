import { useEffect, useState } from "react";
import "../style/addtask.css";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getTask(id);
  }, [id]);

  const getTask = async (id) => {
    try {
      let res = await fetch(`http://localhost:5000/task/${id}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success && data.task) {
        setTaskData(data.task);
      } else {
        alert(
          data.message || "Failed to fetch task details. Please login again"
        );
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching task: ", err);
      alert("Error fetching task details");
    }
  };

  const updateTask = async () => {
    if (!taskData.title || !taskData.description) {
      alert("Please fill in both title and description");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/update-task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Task updated successfully");
        navigate("/");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating task");
    }
  };

  return (
    <div className="container">
      <h1>Update Task</h1>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter task title"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter task description"
          value={taskData.description}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
          className="textarea-field"
        ></textarea>
      </div>

      <button onClick={updateTask} className="update-item">
        Update Task
      </button>
    </div>
  );
}
