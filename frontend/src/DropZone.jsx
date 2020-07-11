import React, { useState } from "react";
import PropTypes from "prop-types";

const DropZone = ({ handleFilesDrop }) => {
  const [dragging, setDragging] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const onFilesDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFilesDrop(e);
  };

  return (
    <div
      className="dropzone"
      onDrop={onFilesDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{ backgroundColor: dragging ? "#a8a8a8" : "#c5c5c5" }}
    >
      <span>Choose files or drag 'n' drop them here</span>
    </div>
  );
};

DropZone.propTypes = {
  handleFilesDrop: PropTypes.func,
};

export default DropZone;
