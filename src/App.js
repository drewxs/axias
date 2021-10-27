import { useState } from 'react';
import axios from 'axios';
import prettyBytes from 'pretty-bytes';
import {
	FormControl,
	MenuItem,
	InputLabel,
	Select,
	TextField,
	Button,
	Tabs,
	Tab,
} from '@mui/material';
import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/javascript/javascript');

function App() {
	const [method, setMethod] = useState('GET');
	const [reqUrl, setReqUrl] = useState('');
	const [tab, setTab] = useState(0);
	const [resTab, setResTab] = useState(0);
	const [keyValues, setKeyValues] = useState([
		{
			key: '',
			value: '',
		},
	]);
	const [headers, setHeaders] = useState([
		{
			key: '',
			value: '',
		},
	]);
	const [reqBody, setReqBody] = useState('');
	const [resHeaders, setResHeaders] = useState({});
	const [resStatus, setResStatus] = useState('');
	const [resBody, setResBody] = useState('');
	const [resTime, setResTime] = useState('');
	const [resSize, setResSize] = useState('');
	const [resExists, setResExists] = useState(false);

	const updateEndTime = (response) => {
		response.customData = response.customData || {};
		response.customData.time =
			new Date().getTime() - response.config.customData.startTime;
		return response;
	};
	axios.interceptors.request.use((request) => {
		request.customData = request.customData || {};
		request.customData.startTime = new Date().getTime();
		return request;
	});

	axios.interceptors.response.use(updateEndTime, (e) => {
		Promise.reject(updateEndTime(e.response));
	});

	const handleReqSubmit = (e) => {
		e.preventDefault();

		var x = {
			url: reqUrl,
			method: method,
			params: kvToObjects(),
			headers: headersToObjects(),
			data: JSON.parse(reqBody),
		};
		axios(x)
			.catch((e) => e)
			.then((res) => {
				console.log(res);
				setResStatus(res.status);
				setResBody(res.data);
				setResTime(res.customData?.time);
				setResSize(
					prettyBytes(
						JSON.stringify(res.data)?.length +
							JSON.stringify(res.headers)?.length
					)
				);
				setResExists(true);
				setResHeaders(res.headers);
			});
	};

	const handleTabChange = (e, newTab) => {
		setTab(newTab);
	};
	const handleResTabChange = (e, newTab) => {
		setResTab(newTab);
	};

	const handleInputChange = (e, i) => {
		const { name, value } = e.target;
		const list = [...keyValues];
		list[i][name] = value;
		setKeyValues(list);
	};
	const updateHeader = (e, i) => {
		const { name, value } = e.target;
		const list = [...headers];
		list[i][name] = value;
		setHeaders(list);
	};

	const removeKeyValue = (i) => {
		const list = [...keyValues];
		list.splice(i, 1);
		setKeyValues(list);
	};
	const removeHeader = (i) => {
		const list = [...headers];
		list.splice(i, 1);
		setHeaders(list);
	};

	const addKeyValue = () => {
		setKeyValues([...keyValues, { key: '', value: '' }]);
	};
	const addHeader = () => {
		setHeaders([...headers, { key: '', value: '' }]);
	};

	const kvToObjects = () => {
		return [...keyValues].reduce((data, pair) => {
			if (pair.key === '') return data;
			return { ...data, [pair.key]: pair.value };
		}, {});
	};
	const headersToObjects = () => {
		return [...headers].reduce((data, pair) => {
			if (pair.key === '') return data;
			return { ...data, [pair.key]: pair.value };
		}, {});
	};

	return (
		<div className="app">
			<h1>Axias</h1>
			<form className="req-form" onSubmit={handleReqSubmit}>
				<FormControl>
					<InputLabel>Method</InputLabel>
					<Select
						id="method-select"
						value={method}
						label="Method"
						onChange={(e) => setMethod(e.target.value)}
					>
						<MenuItem value={'GET'}>GET</MenuItem>
						<MenuItem value={'POST'}>POST</MenuItem>
						<MenuItem value={'PUT'}>PUT</MenuItem>
						<MenuItem value={'PATCH'}>PATCH</MenuItem>
						<MenuItem value={'DELETE'}>DELETE</MenuItem>
					</Select>
				</FormControl>
				<TextField
					id="api-input"
					variant="outlined"
					placeholder="https://example.com"
					value={reqUrl}
					onChange={(e) => setReqUrl(e.target.value)}
				></TextField>
				<Button variant="contained" type="submit">
					Send
				</Button>
			</form>
			<div className="container">
				<Tabs value={tab} onChange={handleTabChange}>
					<Tab label="Query Parameters" />
					<Tab label="Headers" />
					<Tab label="JSON" />
				</Tabs>
				{tab === 0 && (
					<div className="tab-panel">
						{keyValues.map((pair, i) => {
							return (
								<div className="req-form">
									<TextField
										variant="outlined"
										placeholder="Key"
										name="key"
										value={pair.key}
										onChange={(e) =>
											handleInputChange(e, i)
										}
										autoComplete="off"
									></TextField>
									<TextField
										variant="outlined"
										placeholder="Value"
										name="value"
										value={pair.value}
										onChange={(e) =>
											handleInputChange(e, i)
										}
										autoComplete="off"
									></TextField>
									<Button
										variant="outlined"
										className="delete"
										onClick={() => removeKeyValue(i)}
									>
										Remove
									</Button>
								</div>
							);
						})}
						<Button
							variant="outlined"
							className="add"
							onClick={addKeyValue}
						>
							Add
						</Button>
					</div>
				)}
				{tab === 1 && (
					<div className="tab-panel">
						{headers.map((pair, i) => {
							return (
								<div className="req-form">
									<TextField
										variant="outlined"
										placeholder="Key"
										name="key"
										value={pair.key}
										onChange={(e) => updateHeader(e, i)}
										autoComplete="off"
									></TextField>
									<TextField
										variant="outlined"
										placeholder="Value"
										name="value"
										value={pair.value}
										onChange={(e) => updateHeader(e, i)}
										autoComplete="off"
									></TextField>
									<Button
										variant="outlined"
										className="delete"
										onClick={() => removeHeader(i)}
									>
										Remove
									</Button>
								</div>
							);
						})}
						<Button
							variant="outlined"
							className="add"
							onClick={addHeader}
						>
							Add
						</Button>
					</div>
				)}
				{tab === 2 && (
					<div className="tab-panel">
						<CodeMirror
							value={reqBody}
							options={{
								mode: 'javascript',
								theme: 'material',
								lineNumbers: true,
								tabSize: 8,
							}}
							onBeforeChange={(editor, data, value) => {
								setReqBody(value);
							}}
							onChange={(editor, data, value) => {
								setReqBody(value);
							}}
						/>
					</div>
				)}
			</div>
			{resExists && (
				<>
					<div className="response">
						<h3>Response</h3>
						<div className="stats">
							<div className="stat">Status: {resStatus}</div>
							<div className="stat">Time: {resTime} ms</div>
							<div className="stat">Size: {resSize}</div>
						</div>
					</div>
					<div className="container">
						<Tabs value={resTab} onChange={handleResTabChange}>
							<Tab label="Body" />
							<Tab label="Headers" />
						</Tabs>
						{resTab === 0 && (
							<CodeMirror
								value={JSON.stringify(resBody, null, 2)}
								options={{
									mode: 'javascript',
									theme: 'material',
									lineNumbers: true,
									tabSize: 8,
								}}
							/>
						)}
						{resTab === 1 && (
							<div className="tab-panel res-headers">
								{Object.entries(resHeaders).map(
									([key, value]) => {
										return (
											<div className="res-header">
												<div className="key">{key}</div>
												<div className="value">
													{value}
												</div>
											</div>
										);
									}
								)}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default App;
