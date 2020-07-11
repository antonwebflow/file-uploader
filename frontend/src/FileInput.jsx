import React, { useRef, useState } from "react";
import post from "./post";
import DropZone from "./DropZone";

const FileInput = () => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [status, setStatus] = useState({
    error: "",
    emails: [],
    state: "initial",
  });
  const inputEl = useRef(null);

  const handleChange = async (e) => {
    setStatus({ state: "initial" });
    const combinedEmails = [];
    const names = [];

    let fileListArray = undefined;

    if (e.dataTransfer?.files) {
      fileListArray = Array.from(e.dataTransfer.files);
    } else {
      fileListArray = Array.from(inputEl.current.files);
    }
    await Promise.all(
      fileListArray.map(async (file) => {
        names.push(file.name);
        const text = await file.text();
        const emails = text.trim().split(/\n/);
        combinedEmails.push(...emails);
      })
    );

    setFileNames(names);

    const uniqueEmails = new Set(combinedEmails);

    setEmails(Array.from(uniqueEmails));
  };
  const onButtonClick = (e) => {
    e.preventDefault();
    inputEl.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await post(emails);
    setLoading(false);
    if (response.ok) {
      setStatus({ state: "success" });
      setFileNames([]);
      inputEl.current.value = null;
    } else {
      const text = await response.text();
      const parsedText = JSON.parse(text);
      setStatus({ status: "error", ...parsedText });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputEl}
        onChange={handleChange}
        type="file"
        multiple
        accept=".txt"
        hidden
      />
      <button onClick={onButtonClick}>Choose files</button>
      <DropZone handleFilesDrop={handleChange} />

      <ul>
        {fileNames.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button disabled={loading || fileNames.length === 0}>Send emails</button>

      {loading && <h4>Loading...</h4>}

      {status?.state === "success" && <h4>Emails sent successfully</h4>}

      <h4>{status?.error}</h4>
      <ul>
        {status?.emails?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {JSON.stringify(status)}
    </form>
  );
};

export default FileInput;
