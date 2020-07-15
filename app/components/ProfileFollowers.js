import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import LoadingDotsIcon from "./LoadingDotsIcon";

export default function ProfileFollowers() {
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    (async function fetchFollowers() {
      try {
        const response = await axios.get(`/profile/${username}/followers`, {
          cancelToken: ourRequest.token,
        });
        setFollowers(response.data);
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
      {followers.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} />
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
}
