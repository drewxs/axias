import { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Box,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Button,
	Tabs,
	Tab,
	Typography,
} from '@mui/material';

function App() {
	const [method, setMethod] = useState('GET');
	const [tab, setTab] = useState(0);

	const handleSelectMethod = (e) => {
		setMethod(e.target.value);
	};

	const handleReqSubmit = (e) => {
		e.preventDefault();
		console.log('submit');
	};

	const handleTabChange = (e, newTab) => {
		setTab(newTab);
	};

	function TabPanel(props) {
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
					<Box sx={{ p: 3 }}>
						<Typography>{children}</Typography>
					</Box>
				)}
			</div>
		);
	}

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
					<Select
						id="method-select"
						value={method}
						label="Method"
						onChange={handleSelectMethod}
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
			<Box>
				<Tabs
					value={tab}
					onChange={handleTabChange}
					aria-label="basic tabs example"
				>
					<Tab label="Query Parameters" {...a11yProps(0)} />
					<Tab label="Headers" {...a11yProps(1)} />
					<Tab label="JSON" {...a11yProps(2)} />
				</Tabs>
				<TabPanel value={tab} index={0}>
					<form className="req-form">
						<TextField
							variant="outlined"
							placeholder="Key"
						></TextField>
						<TextField
							variant="outlined"
							placeholder="Value"
						></TextField>
						<Button variant="outlined" className="delete">
							Remove
						</Button>
					</form>
					<Button variant="outlined" className="add">
						Add
					</Button>
				</TabPanel>
				<TabPanel value={tab} index={1}>
					Item Two
				</TabPanel>
				<TabPanel value={tab} index={2}>
					Item Three
				</TabPanel>
			</Box>
		</div>
	);
}

export default App;
