import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

export default function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    (async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);

        return () => {
          ourRequest.cancel();
        };
      } catch (e) {
        console.log(e.response.data);
      }
    })();
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map(post => {
        return <Post key={post._id} post={post} noAuthor={true} />;
      })}
    </div>
  );
}
