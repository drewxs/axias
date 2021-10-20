import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { KeyValue } from './components/KeyValue';
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

export const App = () => {
	const [method, setMethod] = useState('GET');
	const [tab, setTab] = useState(0);
	const [keyValues, setKeyValues] = useState([
		{
			key: '',
			value: '',
			idx: 0,
		},
	]);

	const handleReqSubmit = (e) => {
		e.preventDefault();
		console.log('submit');
	};

	const handleTabChange = (e, newTab) => {
		setTab(newTab);
	};

	const removeKeyValue = (idx) => {
		setKeyValues(keyValues.filter((item) => item.idx !== idx));
	};

	useEffect(() => {
		console.log(keyValues);
	}, [keyValues]);

	const TabPanel = (props) => {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<div className="tab">
						<Typography>{children}</Typography>
					</div>
				)}
			</div>
		);
	};

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
	};

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}

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
				></TextField>
				<Button variant="contained" type="submit">
					Send
				</Button>
			</form>
			<div className="container">
				<Tabs
					value={tab}
					onChange={handleTabChange}
					aria-label="basic tabs example"
				>
					<Tab label="Query Parameters" {...a11yProps(0)} />
					<Tab label="Headers" {...a11yProps(1)} />
					<Tab label="JSON" {...a11yProps(2)} />
				</Tabs>
				<TabPanel className="tab-panel" value={tab} index={0}>
					{keyValues.length !== 0 &&
						keyValues?.map((pair, idx) => (
							<KeyValue
								pair={pair}
								removeKeyValue={removeKeyValue}
								key={idx}
							/>
						))}
					<Button
						variant="outlined"
						className="add"
						onClick={() =>
							setKeyValues([
								...keyValues,
								{
									key: '',
									value: '',
									idx: keyValues.length + 1,
								},
							])
						}
					>
						Add
					</Button>
				</TabPanel>
				<TabPanel className="tab-panel" value={tab} index={1}>
					Item Two
				</TabPanel>
				<TabPanel className="tab-panel" value={tab} index={2}>
					<div data-json-request-body className="json"></div>
				</TabPanel>
			</div>
		</div>
	);
};
