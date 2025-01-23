"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SearchBar from './components/SearchBar';

// Type definition: category
interface Category {
  id: number;
  name: string;
}

// Type definition: post
interface Post {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  author: string;
  date: string;
}

function Index() {
  // States
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const postsPerPage = 5;


  //Fetch posts & categories upon load
  useEffect(() => {
    updatePosts();
    updateCategories();
  }, []);

  const updatePosts = async () => {
    try {
      const response = await axios.get(
        "https://public-api.wordpress.com/wp/v2/sites/testsiteexam.wordpress.com/posts/"
      );
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategories = async () => {
    try {
      const response = await axios.get(
        "https://public-api.wordpress.com/wp/v2/sites/testsiteexam.wordpress.com/categories/"
      );
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categoryFilter = async (categoryId: number) => {
    try {
      const response = await axios.get(
        "https://public-api.wordpress.com/wp/v2/sites/testsiteexam.wordpress.com/posts/",
        {
          params: {
            categories: categoryId,
          },
        }
      );
      setPosts(response.data);
      setFilteredPosts(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter posts based on the search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.rendered.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
    setCurrentPage(1);
  };

  // Display max 5 posts
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Blog Posts</h1>

      <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />

      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-700 mb-2">CATEGORIES</h2>
        <ul className="flex flex-wrap gap-4">
          {categories.map((category) => {
            return (
              <li key={category.id}>
                <button
                  onClick={() => categoryFilter(category.id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {category.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="space-y-6">
        {currentPosts.map((post) => (
          <li
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{post.title.rendered}</h2>
            <p className="text-sm text-gray-600">By {post.author}</p>
            <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
            <Link href={"/blog/" + post.id}>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Read More
              </button>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <span className="self-center text-lg">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * postsPerPage >= filteredPosts.length}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition-colors"
        >
          Next
        </button>
      </div>

      <button
        onClick={updatePosts}
        className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Refresh Posts
      </button>
    </div>
  );
}

export default Index;
