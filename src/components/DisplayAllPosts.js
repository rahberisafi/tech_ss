import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CreateNewPost from "./CreateNewPost";
import ModifyPost from "./ModifyPost";
import Post from "./Post";

// The REST API endpoint
const API_URL = "https://jsonplaceholder.typicode.com/posts?userId=2";

const DisplayAllPosts = () => {
  // managing states below
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [visible, setVisible] = useState(10);

  const showMoreItems = () => {
     setVisible((prevValue) => prevValue + 10);
  }

  // Define the function that fetches the data from API
  const fetchData = async () => {
    const { data } = await axios.get(API_URL);
    setAllPosts(data);
  };

  // Trigger the fetchData after the initial render by using the useEffect hook
  useEffect(() => {
    fetchData();
  }, []);
  // const [allPosts, setAllPosts] = useState([]) // can also be used
  const [isCreateNewPost, setIsCreateNewPost] = useState(false);
  const [isModifyPost, setIsModifyPost] = useState(false);
  const [editPostId, setEditPostId] = useState("");

  // Initialize useRef (to empty title and body once saved)
  const getTitle = useRef();
  const getBody = useRef();

  // function 1 (accepting title in state by user input)
  const savePostTitleToState = (event) => {
    setTitle(event.target.value);
  };

  // function 2 (accepting body/description in state by user input)
  const savePostBodyToState = (event) => {
    setBody(event.target.value);
  };

  // function 3 (to save title and body in allPosts state)
  const savePost = (event) => {
    event.preventDefault();
    const id = Date.now();
    setAllPosts([...allPosts, { title, body, id }]);
    getTitle.current.value = "";
    getBody.current.value = "";
    toggleCreateNewPost();
  };

  // function 4 (toggle create new post visibility)
  const toggleCreateNewPost = () => {
    setIsCreateNewPost(!isCreateNewPost);
  };

  // function 5 (toggle post editing)
  const toggleModifyPostComponent = () => {
    setIsModifyPost(!isModifyPost);
  };

  // function 6 (to edit posts)
  const editPost = (id) => {
    setEditPostId(id);
    toggleModifyPostComponent();
  };

  // function 7 (to update the posts)
  const updatePost = (event) => {
    event.preventDefault();
    const updatedPost = allPosts.map((eachPost) => {
      if (eachPost.id === editPostId) {
        return {
          ...eachPost,
          title: title || eachPost.title,
          body: body || eachPost.body
        };
      }

      return eachPost;
    });
    setAllPosts(updatedPost);
    toggleModifyPostComponent();
  };

  // function 8 (to delete posts)
  const deletePost = (id) => {
    const modifiedPost = allPosts.filter((eachPost) => {
      return eachPost.id !== id;
    });
    setAllPosts(modifiedPost);
  };

  if (isCreateNewPost) {
    return (
      <>
        <CreateNewPost
          savePostTitleToState={savePostTitleToState}
          savePostBodyToState={savePostBodyToState}
          getTitle={getTitle}
          getBody={getBody}
          savePost={savePost}
        />
        {/* Cancel Button */}
        <button
          className="btn btn-danger cancel-button mt-2"
          onClick={toggleCreateNewPost}
        >
          Cancel
        </button>
      </>
    );
  } else if (isModifyPost) {
    const post = allPosts.find((post) => {
      return post.id === editPostId;
    });

    return (
      <>
        <ModifyPost
          title={post.title}
          body={post.body}
          updatePost={updatePost}
          savePostTitleToState={savePostTitleToState}
          savePostBodyToState={savePostBodyToState}
          toggleCreateNewPost={toggleCreateNewPost}
        />
        <button
          className="btn btn-danger cancel-update-button mt-2"
          onClick={toggleModifyPostComponent}
        >
          Cancel
        </button>
      </>
    );
  }
  
  return (
    <>
      <h2>TechNext Posts</h2>
      <button
        className="btn btn-outline-info button-edits create-post"
        onClick={toggleCreateNewPost}
      >
        Create New
      </button>
      {!allPosts.length ? (
        <div>
          <li>There are no posts yet.</li>
        </div>
      ) : (
        allPosts.slice(0, visible).map((eachPost) => (
          <Post
            id={eachPost.id}
            key={eachPost.id}
            title={eachPost.title}
            body={eachPost.body}
            editPost={editPost}
            deletePost={deletePost}
          />
        ))
      )}

     <button
        className="btn btn-outline-info button-edits create-post"
        onClick={showMoreItems}
      >
        Loading
      </button>
 
    </>
  );
};
export default DisplayAllPosts;
