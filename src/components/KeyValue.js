import React from 'react';
import { TextField, Button } from '@mui/material';

export const KeyValue = ({ pair, removeKeyValue }) => {
	return (
		<>
			<form className="req-form">
				<TextField variant="outlined" placeholder="Key"></TextField>
				<TextField variant="outlined" placeholder="Value"></TextField>
				<Button
					variant="outlined"
					className="delete"
					onClick={() => removeKeyValue(pair.idx)}
				>
					Remove
				</Button>
			</form>
		</>
	);
};
