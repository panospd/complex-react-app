import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import LoadingDotsIcon from "./LoadingDotsIcon";

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
  }, []);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate);
        const dateFormatted = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;

        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />
            {post.title} <strong></strong>
            <span className="text-muted small">{dateFormatted} </span>
          </Link>
        );
      })}
    </div>
  );
}
