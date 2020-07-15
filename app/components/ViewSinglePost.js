import React, { useState, useEffect, useContext } from "react";
import ReactTooltip from "react-tooltip";
import { useParams, Link, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import axios from "axios";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSinglePost(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    (async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e.response.data);
      }
    })();

    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isLoading && !post) return <NotFound />;

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  const isOwner = () => {
    return appState.loggedIn && appState.user.username === post.author.username;
  };

  const deleteHandler = async () => {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );

    if (areYouSure) {
      try {
        const response = await axios.delete(`/post/${id}`, {
          data: {
            token: appState.user.token,
          },
        });

        if (response.data === "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Post was successfully deleted.",
          });

          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log(e.response.data);
      }
    }
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem",
          ]}
        />
      </div>
    </Page>
  );
}

export default withRouter(ViewSinglePost);
