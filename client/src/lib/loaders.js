import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

// List page loader - fetch all posts with query params
export const listPageLoader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  
  const postPromise = apiRequest.get(`/posts${query ? `?${query}` : ""}`);
  
  return defer({
    postResponse: postPromise,
  });
};

// Single page loader - fetch single post
export const singlePageLoader = async ({ params }) => {
  const postPromise = apiRequest.get(`/posts/${params.id}`);
  
  return defer({
    postResponse: postPromise,
  });
};

// Profile page loader - fetch user's posts and saved posts
export const profilePageLoader = async () => {
  // Use apiRequest which already includes the token from interceptor
  const postPromise = apiRequest.get("/users/profilePosts");
  const chatPromise = apiRequest.get("/chats").catch(() => ({ data: [] }));
  
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};