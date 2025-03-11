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
    const [reviews, setReviews] = useState<Review[]>([]); // Review型の配列に変更
    const [error, setError] = useState<string | null>(null); // エラーメッセージの状態を管理

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews') // 'reviews'テーブルから取得
                .select('*'); // すべてのカラムを取得

            if (error) {
                setError(error.message); // エラーメッセージを状態に保存
            } else {
                setReviews(data); // 取得したレビューを状態に保存
            }
        };

        fetchReviews(); // レビューを取得
    }, []);

    return (
        <div>
            <h1>レビュー一覧</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージを表示 */}
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id}>
                        <h2>{review.title}</h2>
                        <p>{review.content}</p>
                        <p>投稿者: {review.username}</p>
                    </div>
                ))
            ) : (
                <p>レビューはありません。</p>
            )}
            <Link href="/">戻る</Link>
        </div>
    );
};

export default ReviewsPage; 