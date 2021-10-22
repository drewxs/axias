import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
	FormControl,
	MenuItem,
	InputLabel,
	Select,
	TextField,
	Button,
	Tabs,
	Tab,
	Typography,
} from '@mui/material';

function App() {
	const [method, setMethod] = useState('GET');
	const [reqUrl, setReqUrl] = useState('');
	const [tab, setTab] = useState(0);
	const [keyValues, setKeyValues] = useState([
		{
			key: '',
			value: '',
		},
	]);

	const handleReqSubmit = (e) => {
		e.preventDefault();

		var x = {
			url: reqUrl,
			method: method,
			params: keyValues,
			headers: keyValues,
		};
		console.log(x);
		//axios(x).then((res) => console.log(res));
	};

	const handleTabChange = (e, newTab) => {
		setTab(newTab);
	};

	const removeKeyValue = (i) => {
		const list = [...keyValues];
		list.splice(i, 1);
		setKeyValues(list);
	};

	const addKeyValue = () => {
		setKeyValues([...keyValues, { key: '', value: '' }]);
	};

	const handleInputChange = (e, i) => {
		const { name, value } = e.target;
		const list = [...keyValues];
		list[i][name] = value;
		setKeyValues(list);
	};

	return (
		<div className="app">
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
				{tab === 1 && <div className="tab-panel">Headers</div>}
				{tab === 2 && <div className="tab-panel">JSON</div>}
			</div>
		</div>
	);
}

export default App;
