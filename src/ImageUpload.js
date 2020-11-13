import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from 'firebase';
import { db, storage } from './firebase';
import './ImageUpload.css';

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state__chnaged",
            (snapshot) => {
                //progress Function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error Function
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post Images inside
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            username: username
                        });
                    })

                setProgress(0);
                setImage(null);
                setCaption('');
            }
        )
    }

    return (
        <div className="imageupload">
            {/* {i want to have} */}
            {/* {Input for caption} */}
            {/* {file picker} */}
            {/* {POST button to post} */}
            <progress className="image__uploadProgress" value={progress} max="100" />
            <input type="text" placeholder="Enter your caption" onChange={event => { setCaption(event.target.value) }} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
