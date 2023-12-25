import React, { useState } from 'react';

const FileUploadForm = (props) => {



    const API = process.env.REACT_APP_API

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null)


console.log(file)

  const handleFileChange = (event) => {

    setFilePreview(URL.createObjectURL(event.target.files[0]));

    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
      formData.append('file', file);
      formData.append('userID', props.userID);
      formData.append('userNickname', props.nickname);



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
    
    <form onSubmit={handleFormSubmit} encType="multipart/form-data" className='upload-form'>

      <div className="avatar-preview-container">
        <img className='avatar-preview' src={!filePreview ? props.avatar : filePreview} alt="" />
      
        <label className='choose-avatar-btn' htmlFor="avatar-input">Wybierz plik</label>
      </div>

      <input className='hidden' name='avatar-input' id='avatar-input' type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
   


      {
        file && 

        <button className='settings-save-btn' type="submit">Zapisz</button>
        
        } 
      {/* <p>{file?.name}</p> */}

    </form>
  );
};

export default FileUploadForm;
