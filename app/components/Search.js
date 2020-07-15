import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";

import axios from "axios";

import DispatchContext from "../DispatchContext";

export default function Search() {
  const [state, setState] = useImmer({
    searctTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);

    return () => {
      document.removeEventListener("keyup", searchKeyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (state.searctTerm.trim()) {
      setState(draft => {
        draft.show = "loading";
      });

      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++;
        });
      }, 700);

      return () => {
        clearTimeout(delay);
      };
    } else {
      setState(draft => {
        draft.show = "neither";
      });
    }
  }, [state.searctTerm]);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    if (state.requestCount) {
      (async function fetchPosts() {
        try {
          const response = await axios.post(
            "/search",
            {
              searchTerm: state.searctTerm,
            },
            {
              cancelToken: ourRequest.token,
            }
          );

          setState(draft => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (e) {
          console.log(e.response.data);
        }
      })();
    }

    return () => {
      ourRequest.cancel();
    };
  }, [state.requestCount]);

  function searchKeyPressHandler(e) {
    if (e.keyCode === 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  function handleInput(e) {
    const value = e.target.value;

    setState(draft => {
      draft.searctTerm = value;
    });
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInput}
          />
          <span
            onClick={() => appDispatch({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show === "results" ? "live-search-results--visible" : "")
            }
          >
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{" "}
                  {state.results.length === 1 ? "item" : "items"} found)
                </div>
                {state.results.map(post => {
                  const date = new Date(post.createdDate);
                  const dateFormatted = `${
                    date.getMonth() + 1
                  }/${date.getDate()}/${date.getFullYear()}`;

                  return (
                    <Link
                      onClick={() => appDispatch({ type: "closeSearch" })}
                      key={post._id}
                      to={`/post/${post._id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <img className="avatar-tiny" src={post.author.avatar} />
                      {post.title} <strong></strong>
                      <span className="text-muted small">
                        by {post.author.username} on {dateFormatted}{" "}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry we could not find any results for that search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
