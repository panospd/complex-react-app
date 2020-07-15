import React, { useContext, useEffect } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import LoadingDotsIcon from "./LoadingDotsIcon";

import axios from "axios";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import Post from "./Post";

export default function Home() {
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await axios.post(
          "/getHomeFeed",
          {
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );

        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });

        return () => {
          ourRequest.cancel();
        };
      } catch (e) {
        console.log(e.response.data);
      }
    })();
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center ,b-4">
            The latest from those you follow.
          </h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Post key={post._id} post={post} />;
            })}
          </div>
        </>
      )}
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
}
