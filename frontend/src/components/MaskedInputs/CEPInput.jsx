import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import OutlinedInput from '@mui/material/OutlinedInput';
import { forwardRef } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const CEPMask = forwardRef(function CEPMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00.000-000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

CEPMask.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function CEPInput({ value, handleChange, ...props }) {
  return (
    <FormControl {...props} variant="outlined">
      {props.label && <InputLabel htmlFor={props.id}>{props.label}</InputLabel>}
      <OutlinedInput
        {...props}
        value={value}
        onChange={handleChange}
        inputComponent={CEPMask}
      />
    </FormControl>
  );
}
