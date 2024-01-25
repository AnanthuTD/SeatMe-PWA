'use client'
import React, { useState } from "react";
import { SortableList } from "./components/page";
import { createRange } from "./utilities";
import "./styles.css";

function getMockItems() {
  return createRange(50, (index) => ({ id: index + 1, course: 'course-' + (index + 1) }));
}

export default function App() {
  const [items, setItems] = useState(getMockItems());

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sortable Exam List</h1>
      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id} className="bg-white shadow-sm rounded-md p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-4 text-lg font-bold">Exam ID: {item.id}</span>
              <span>Course: {item.course}</span>
            </div>
            <SortableList.DragHandle className="cursor-grab" />
          </SortableList.Item>
        )}
      />
    </div>
  );
}