import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCol from "../Components/TaskCol";
import Footer from "../Components/Footer";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://task-manager-server-side-delta.vercel.app/tasks";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });
  const [editTask, setEditTask] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
  
    const draggedTaskId = active.id;
    const overCategory = over.id;
  
    // Find the dragged task
    const draggedTask = tasks.find((task) => task._id === draggedTaskId);
    if (!draggedTask) return;
  
    // If the task was moved to a different category
    if (draggedTask.category !== overCategory) {
      const updatedTasks = tasks.map((task) =>
        task._id === draggedTaskId ? { ...task, category: overCategory } : task
      );
      setTasks(updatedTasks);
  
      try {
        await axios.put(`${API_URL}/${draggedTaskId}`, {
          category: overCategory,
        });
      } catch (error) {
        console.error("Error updating task category:", error);
      }
    } else {
      // If the task was just reordered within the same category
      const filteredTasks = tasks.filter((task) => task.category === overCategory);
      const oldIndex = filteredTasks.findIndex((task) => task._id === draggedTaskId);
      const newIndex = filteredTasks.findIndex((task) => task._id === over.id);
  
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedTasks = arrayMove(filteredTasks, oldIndex, newIndex);
        setTasks([
          ...tasks.filter((t) => t.category !== overCategory),
          ...updatedTasks,
        ]);
      }
    }
  };
  

  const handleTaskDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Task Deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskEdit = (task) => {
    setEditTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
    });
  };

  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    if (!editTask) return;

    try {
      await axios.put(`${API_URL}/${editTask._id}`, newTask);
      setTasks(
        tasks.map((task) =>
          task._id === editTask._id ? { ...task, ...newTask } : task
        )
      );
      setNewTask({ title: "", description: "", category: "To-Do" });
      setEditTask(null);
      toast.success("Task Updated!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", category: "To-Do" });
      toast.success("Task Added");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="bg-[#D4CAE7]">
      <div className="py-2 px-2">
        <Navbar setUser={setUser} user={user} />
      </div>

      <div className="px-10 mt-6">
        {user && (
          <form
            onSubmit={editTask ? handleTaskUpdate : handleTaskSubmit}
            className="mb-4 bg-white p-4 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-bold mb-2">
              {editTask ? "Edit Task" : "Add a New Task"}
            </h3>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleTaskChange}
              placeholder="Task Title"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleTaskChange}
              placeholder="Task Description"
              className="w-full p-2 border rounded mb-2"
            ></textarea>
            <select
              name="category"
              value={newTask.category}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              type="submit"
              className="bg-black text-white text-[10px] lg:text-base cursor-pointer font-semibold px-3 lg:px-5 py-2 lg:py-3 rounded-full"
            >
              {editTask ? "Update Task" : "Add Task"}
            </button>
          </form>
        )}

        {user ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["To-Do", "In Progress", "Done"].map((category) => (
                <TaskCol
                  key={category}
                  category={category}
                  tasks={tasks.filter((t) => t.category === category)}
                  onEdit={handleTaskEdit}
                  onDelete={handleTaskDelete}
                />
              ))}
            </div>
          </DndContext>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h2 className="text-center text-4xl font-bold text-black">
              Please Login First
            </h2>
          </div>
        )}
      </div>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Home;
