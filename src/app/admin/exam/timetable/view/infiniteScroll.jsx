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
	const [searchedColumn, setSearchedColumn] = useState("id");
	const [sorterField, setSorterField] = useState("");
	const [sorterOrder, setSorterOrder] = useState("");
	const [hasMoreData, setHasMoreData] = useState(true);
	const [loadData, setLoadData] = useState(true);
	const [addedDataLength, setAddedDataLength] = useState(0);

	const getExamCount = async () => {
		const result = await axios.get("/api/admin/exams/count");
		setExamCount(result.data);
	};

	const loadMoreData = ({ search = false }) => {
		if (loading) {
			return;
		}
		const resultsPerPage = 10;
		setLoading(true);
		axios
			.get(`/api/admin/exams/`, {
				params: {
					query: searchText,
					column: searchedColumn,
					sortField: sorterField,
					sortOrder: sorterOrder,
					limit: resultsPerPage,
					offset: startIndex,
				},
			})
			.then((response) => {
				const newExams = response.data;
				setAddedDataLength(newExams.length);
				if (search) {
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
		console.log("load data");
	}, [loadData]);

	useEffect(() => {
		console.log(addedDataLength);
		if (addedDataLength < 10) {
			setHasMoreData(false);
			console.log(false);
		} else {
			setHasMoreData(data.length < examCount);
			console.log(true);
		}
	}, [data, examCount]);

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
				pagination={false}
				loading={loading}
				setDataSource={setData}
				setLoading={setLoading}
				setStartIndex={setStartIndex}
				setQuery={setSearchText}
				setDataIndex={setSearchedColumn}
				sorterField={sorterField}
				setSorterField={setSorterField}
				sorterOrder={sorterOrder}
				setSorterOrder={setSorterOrder}
				// loadData={loadMoreData}
				startIndex={startIndex}
				setAddedDataLength={setAddedDataLength}
				setLoadData={setLoadData}
				loadData={loadData}
				searchData={loadMoreData}
				setSearchText={setSearchText}
				searchedColumn={searchedColumn}
				setSearchedColumn={setSearchedColumn}
				searchText={searchText}
				
			/>
		</InfiniteScroll>
	);
};
export default App;
