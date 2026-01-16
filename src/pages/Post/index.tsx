
import React from 'react';
import PostForm from './PostForm';
import PostTable from './PostTable';
import { useLocation } from 'react-router-dom';

const PostsPage: React.FC = () => {
    const location = useLocation();

    return location?.state?.toCreate ? <PostForm /> : <PostTable />;
};

export default PostsPage;
