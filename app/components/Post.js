import React from "react";
import { Link } from "react-router-dom";

export default function Post({ post, onClick, noAuthor }) {
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Link
      onClick={onClick}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />
      {post.title} <strong></strong>
      <span className="text-muted small">
        {!noAuthor && <> by {post.author.username}</>} on {dateFormatted}{" "}
      </span>
    </Link>
  );
}
