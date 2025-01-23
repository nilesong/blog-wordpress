'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

// Type definition: params
interface BlogParams {
    id: string;
}

// Type definition: post
interface Post {
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    author: string;
    date: string;
    jetpack_featured_media_url: string;
}

const Blog = ({ params }: { params: BlogParams }) => {
    const { id } = React.use(params);

    // Initialize post
    const [post, setPost] = useState<Post>({
        title: {
            rendered: 'Loading...',
        },
        content: {
            rendered: 'Loading...',
        },
        author: 'Unknown',
        date: '2025-01-01T00:00:00',
        jetpack_featured_media_url: 'https://testsiteexam.wordpress.com/wp-content/uploads',
    });

    // Show/hide image depending if URL is valid
    const [isImageValid, setIsImageValid] = useState(false); // Set to false initially

    // Fetch data upon load/change of post ID
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(
                    `https://public-api.wordpress.com/wp/v2/sites/testsiteexam.wordpress.com/posts/${id}`
                );
                setPost(response.data);

                // Image URL validator
                const img = new window.Image();
                img.src = response.data.jetpack_featured_media_url;
                img.onload = () => setIsImageValid(true);
                img.onerror = () => setIsImageValid(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPost();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4">
            <Link
                href="/"
                className="self-start mb-6 mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                ← Back to Posts List
            </Link>

            {/* Blog Content */}
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
                {isImageValid && (
                    <Image
                        src={post.jetpack_featured_media_url}
                        alt="Blog Image"
                        width={800}
                        height={400}
                        className="rounded-lg mb-6"
                    />
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                    {post.title.rendered}
                </h1>
                <p className="text-sm text-gray-600 text-center mb-6">
                    By {post.author} | {formatDate(post.date)}
                </p>
                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
            </div>
        </div>
    );
};

export default Blog;
