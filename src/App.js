import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  //useEffect runs a piece of code on a specific condition
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user is loged inn
        console.log(authUser);
        setUser(authUser);
      } else {
        //user is loged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, userName]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time a new post added this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName
        })
      })
      .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={userName}
              onChange={(e) => { setUserName(e.target.value) }} />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }} />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }} />
            <Button type="submit" onClick={signUp}>SignUp</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }} />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="" />
        {user ?
          (<Button onClick={() => auth.signOut()}>LogOut</Button>)
          : (<div className="app__signUpContainer">
            <Button onClick={() => { setOpenSignIn(true) }}>Sign In</Button>
            <Button onClick={() => { setOpen(true) }}>Sign Up</Button>
          </div>)}
      </div>
      <div className="app__post">
        <div className="app__postleft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} type={post.type} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL} />
            ))
          }
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url='https://www.instagram.com/vijay_sekhar_/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />

        </div>

      </div>

      {user ?
        (<ImageUpload username={user.displayName} />)
        : <h3>Need to Login to Upload</h3>}
    </div>
  );
}

export default App;
