import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import LoadingDotsIcon from "./LoadingDotsIcon";

export default function ProfileFollowing() {
  const [isLoading, setIsLoading] = useState(true);
  const [followings, setFollowings] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    (async function fetchFollowers() {
      try {
        const response = await axios.get(`/profile/${username}/following`, {
          cancelToken: ourRequest.token,
        });
        setFollowings(response.data);
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
      {followings.map((following, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${following.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={following.avatar} />
            {following.username}
          </Link>
        );
      })}
    </div>
  );
}
