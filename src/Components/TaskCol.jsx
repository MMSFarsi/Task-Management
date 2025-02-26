import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";

const TaskCol = ({ category, tasks, onEdit, onDelete }) => {
  const { setNodeRef } = useDroppable({ id: category });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg min-h-[300px]">
      <h2 className="font-bold text-lg mb-3">{category}</h2>
      <SortableContext items={tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task._id)} />
        ))}
      </SortableContext>
    </div>
  );
};

export default TaskCol;
