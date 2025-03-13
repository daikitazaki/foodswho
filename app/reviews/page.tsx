"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
interface Review {
    id: string;
    title: string;
    content: string;
    username: string;
}

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*');

            if (error) {
                setError(error.message);
            } else {
                setReviews(data);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">レビュー一覧</h1>
            {error && <p className="text-red-500">{error}</p>}
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="border border-gray-300 rounded p-4 mb-4">
                        <h2 className="text-xl font-semibold">{review.title}</h2>
                        <p>{review.content}</p>
                        <p className="text-gray-500">投稿者: {review.username}</p>
                    </div>
                ))
            ) : (
                <p>レビューはありません。</p>
            )}
            <Link href="/" className="text-blue-500">戻る</Link>
        </div>
    );
};

export default ReviewsPage; 