import React, { useState } from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

function CheckedButton(props) {
  const [checked, setChecked] = useState(!!props.checked);

  return (
    <>
      <ToggleButton
        type="checkbox"
        variant={props.variant}
        checked={props.checked}
        value={props.value || "1"}
        onChange={(e) => {
          setChecked(e.currentTarget.checked);
          props.onChange(e);
        }}
      >
        { props.name }
      </ToggleButton>
    </>
  );
}

function CheckedButtonGroup(props) {
  return (
    <>
      <ButtonGroup toggle className="mb-2">
        {
          props.btns.map(b => (
            <CheckedButton
              variant={b.variant}
              checked={b.checked}
              name={b.name || 'default'}
              onChange={b.onChange} />
          ))
        }
      </ButtonGroup>
    </>
  );	
}

export default CheckedButtonGroup;
