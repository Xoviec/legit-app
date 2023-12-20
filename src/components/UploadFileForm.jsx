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


    console.log(event.target[0].value)

    console.log(file)
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log(file)
      // Wysłanie pliku do serwera
      const response = await fetch(`${API}/set-avatar/`, {
        method: 'POST',
        body: file,
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
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Wyślij</button>
    </form>
  );
};

export default FileUploadForm;
