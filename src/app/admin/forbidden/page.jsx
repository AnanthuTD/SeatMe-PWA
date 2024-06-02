const Forbidden = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="p-10 bg-white rounded shadow-lg text-center">
				<h1 className="text-5xl font-bold text-red-500">403</h1>
				<h2 className="mt-2 text-2xl font-semibold">Forbidden</h2>
				<p className="mt-4 text-gray-600">
					You do not have permission to access this page.
				</p>
			</div>
		</div>
	);
};

export default Forbidden;
