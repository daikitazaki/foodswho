"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreateReviewPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [restaurants, setRestaurants] = useState<any[]>([]); // レストランの状態を管理
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null); // 選択されたレストラン
    const [user, setUser] = useState<any>(null); // ユーザーの状態を管理
    const router = useRouter();

    useEffect(() => {
        const fetchRestaurants = async () => {
            const { data, error } = await supabase.from('restaurants').select('*');
            if (error) {
                console.error('Error fetching restaurants:', error);
            } else {
                setRestaurants(data);
            }
        };

        const session = supabase.auth.getSession(); // セッションを取得
        session.then(({ data }) => {
            setUser(data.session?.user); // ユーザー情報を設定
        });

        fetchRestaurants(); // レストラン情報を取得
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('reviews')
            .insert([{ title, content, username: user?.email, restaurant_id: selectedRestaurant }]);

        if (error) {
            console.error('Error inserting review:', error);
        } else {
            router.push('/'); // トップページにリダイレクト
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px', backgroundColor: '#fff' }}>
            <h1 style={{ textAlign: 'center', color: '#ff6347' }}>レビュー作成</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>ユーザー名:</label>
                    <p>{user?.email}</p> {/* ユーザー名を表示 */}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>レストラン:</label>
                    <select value={selectedRestaurant || ''} onChange={(e) => setSelectedRestaurant(e.target.value)} required>
                        <option value="">レストランを選択</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>タイトル:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>内容:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', margin: '10px 0', height: '200px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
                    投稿する
                </button>
            </form>
        </div>
    );
};

export default CreateReviewPage; 