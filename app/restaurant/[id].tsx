"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RestaurantDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // URLからレストランIDを取得
    const [restaurant, setRestaurant] = useState<any>(null); // レストランの状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('*')
                    .eq('id', id)
                    .single(); // 単一のレストランを取得

                if (error) {
                    setError(error.message);
                } else {
                    setRestaurant(data);
                }
            }
        };

        fetchRestaurant();
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>エラー: {error}</p>; // エラーがあれば表示
    }

    if (!restaurant) {
        return <p>読み込み中...</p>; // レストラン情報がまだ取得できていない場合
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px' }}>
            <h1 style={{ fontSize: '2.5em', color: '#ff6347' }}>{restaurant.name}</h1>
            <img src="/nextjs-logotype-light-background.png" alt={restaurant.name} style={{ width: '100%', borderRadius: '5px' }} />
            <h2 style={{ marginTop: '20px' }}>詳細情報</h2>
            <p><strong>評価:</strong> {restaurant.rating}</p>
            <p><strong>説明:</strong> {restaurant.description}</p>
            <p><strong>住所:</strong> {restaurant.address}</p>
            <p><strong>電話番号:</strong> {restaurant.phone}</p>
            <button onClick={() => window.history.back()} style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                戻る
            </button>
        </div>
    );
};

export default RestaurantDetail; 