
'use client'

import React, { useState, useEffect } from "react";
import {
	Input,
	Button,
	Row,
	Col,
	Form,
	Divider,
	Card,
	message,
	Alert,
    FloatButton
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import Link from "next/link";
const YourComponent = () => {
  const [departments, setDepartments] = useState([]);

  const loadDepartments = async () => {
    try {
      const result = await axios.get("/api/admin/departments");
      setDepartments(result.data);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  useEffect(() => {
    // Load departments when the component mounts
    loadDepartments();
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <div>
      <h1>Departments</h1>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>{department.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
