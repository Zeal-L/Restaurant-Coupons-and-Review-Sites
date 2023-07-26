import React from "react";
import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight.js";
import IconButton from "@mui/material/IconButton";
import SaveAsIcon from "@mui/icons-material/SaveAs.js";
import EditIcon from "@mui/icons-material/Edit.js";
import PropTypes from "prop-types";

function EditForm (props) {
  const [edit, setEdit] = React.useState(false);
  return (
    <FormControl variant="standard" name={props.label}>
      <InputLabel htmlFor={props.label}>
        {props.label}
      </InputLabel>
      <Input
        id={props.label}
        value={props.value}
        disabled={!edit}
        type={props.type ?? "text"}
        onChange={(event) => {
          props.setValue(event.target.value);
        }}
        startAdornment={
          <InputAdornment position="start">
            <ArrowRightIcon/>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton name="saveBtn" onClick={() => {
              if (edit) {
                props.saveValue(props.value);
              }
              setEdit(!edit);
            }}>
              {
                edit ? <SaveAsIcon/> : <EditIcon/>
              }
            </IconButton>
          </InputAdornment>
        }
      ></Input>
    </FormControl>
  );
}

EditForm.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  saveValue: PropTypes.func,
  type: PropTypes.string
};

export default EditForm;
