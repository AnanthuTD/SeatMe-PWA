"use client";
"use strict";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, Skeleton } from "antd";
import Table from "./table";
import axios from "@/axiosInstance";
const App = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [startIndex, setStartIndex] = useState(0);
	const [examCount, setExamCount] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [sorterField, setSorterField] = useState("");
	const [sorterOrder, setSorterOrder] = useState("");
	const [hasMoreData, setHasMoreData] = useState(true);
	const [addedDataLength, setAddedDataLength] = useState(0);

	const getExamCount = async () => {
		const result = await axios.get("/api/admin/exams/count");
		setExamCount(result.data);
	};

	const loadMoreData = ({ search = false, reset = false }) => {
		if (loading) {
			return;
		}
		const resultsPerPage = 10;
		setLoading(true);
		axios
			.get(`/api/admin/exams/`, {
				params: {
					query: reset ? "" : searchText,
					column: reset ? "" : searchedColumn,
					sortField: reset ? "" : sorterField,
					sortOrder: reset ? "" : sorterOrder,
					limit: resultsPerPage,
					offset: search || reset ? 0 : startIndex,
				},
			})
			.then((response) => {
				const newExams = response.data;
				setAddedDataLength(newExams.length);
				if (search || reset) {
					setData(newExams);
					setStartIndex(newExams.length);
					setAddedDataLength(newExams.length);
					setLoading(false);
				} else {
					setData([...data, ...newExams]);
					setStartIndex(startIndex + newExams.length);
				}
				setLoading(false);
				return true;
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setLoading(false);
				return false;
			});
	};

	useEffect(() => {
		getExamCount();
		loadMoreData({});
	}, []);

	useEffect(() => {
		loadMoreData({ search: true });
	}, [sorterOrder, searchText, searchedColumn, sorterField]);

	useEffect(() => {
		if (addedDataLength < 10) {
			setHasMoreData(false);
		} else {
			setHasMoreData(data.length < examCount);
		}
	}, [data, examCount]);

	const handleReset = () => {
		setStartIndex(0);
		setSearchText("");
		setSorterField("");
		setSorterOrder("");
		setSearchedColumn("");
		// setData([]);
		// loadMoreData({ reset: true });
	};

	return (
		<InfiniteScroll
			dataLength={data.length}
			next={() => loadMoreData({})}
			hasMore={hasMoreData}
			loader={
				<Skeleton
					avatar
					paragraph={{
						rows: 1,
					}}
					active
				/>
			}
			endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
			scrollableTarget="scrollableDiv"
		>
			<Table
				dataSource={data}
				loading={loading}
				setStartIndex={setStartIndex}
				setSorterField={setSorterField}
				setSorterOrder={setSorterOrder}
				setSearchText={setSearchText}
				searchedColumn={searchedColumn}
				setSearchedColumn={setSearchedColumn}
				searchText={searchText}
				handleReset={handleReset}
			/>
		</InfiniteScroll>
	);
};
export default App;
