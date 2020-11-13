
import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/avatar";
import { db } from './firebase';
import firebase from 'firebase';

function Post({ postId, postType, user, username, caption, imageURL }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState(null);


    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp","desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }


        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username : user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');

    }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    src={imageURL}
                    alt={username}
                />

                <h3>{username}</h3>
            </div>
            {/* { header -> avtar ->username} */}
            {postType ==='video'?<video src={imageURL}></video> :
            <img className="post__image" src={imageURL}
                alt="" />}

            {/* {Image} */}

            <h4 className='post__text'><strong>{username}</strong>:{caption}</h4>
            {/* {username+caption} */}

            <div className="post__comments">
                {
                    comments.map((comment)=>(
                        <p>
                                <strong>{comment.username}:</strong>{comment.text}
                            </p>
                    ))
                }
            </div>

                {user && (<form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a Comment........"
                    value={comment}
                    onChange={(e) => { setComment(e.target.value) }}
                />
                <button
                    className="post__button"
                    type="submit"
                    disabled={!comment}
                    onClick={postComment}
                >Post</button>
            </form>)

                }
            
        </div>


    )
}

export default Post
