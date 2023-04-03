import { useState } from "react";

const UploadForm = () => {
  const [fileUrl, setFileUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setFileUrl(data.fileUrl);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      {fileUrl && <p>File uploaded: {fileUrl}</p>}
      {fileUrl && <img src={fileUrl}></img>}
    </div>
  );
};

export default UploadForm;
