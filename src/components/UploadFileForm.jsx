import React, { useState } from 'react';

const FileUploadForm = () => {




    const API = process.env.REACT_APP_API

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
      formData.append('file', file);

      const response = await fetch(`${API}/set-avatar`, {
        method: 'POST',
        body: formData,
      });

      // Obsługa odpowiedzi od serwera
      if (response.ok) {
        console.log('Plik został pomyślnie przesłany!');
      } else {
        console.error('Wystąpił błąd podczas przesyłania pliku.');
      }
    } catch (error) {
      console.error('Wystąpił błąd:', error);
    }
  };

  return (
    
    <form onSubmit={handleFormSubmit} encType="multipart/form-data">
      <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
      <button type="submit">Wyślij</button>
    </form>
  );
};

export default FileUploadForm;