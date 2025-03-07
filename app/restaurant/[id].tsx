"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // 環境変数から取得
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // 環境変数から取得
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RestaurantDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // URLからレストランIDを取得
    const [restaurant, setRestaurant] = useState<any>(null); // レストランの状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (id) {
                try {
                    const { data, error: fetchError } = await supabase
                        .from('restaurants')
                        .select('*')
                        .eq('id', id)
                        .single(); // 単一のレストランを取得

                    if (fetchError) throw fetchError; // エラーがあればスロー
                    setRestaurant(data); // 取得したレストランデータを状態に保存
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setError(err.message); // エラーメッセージを状態に保存
                    } else {
                        setError('Unknown error occurred'); // 不明なエラーの場合の処理
                    }
                }
            }
        };

        fetchRestaurant(); // レストラン情報を取得
    }, [id]);

    if (error) return <p>エラー: {error}</p>; // エラーがあれば表示
    if (!restaurant) return <p>読み込み中...</p>; // データがまだ取得できていない場合

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px' }}>
            <h1 style={{ fontSize: '2.5em', color: '#ff6347' }}>{restaurant.name}</h1>
            <img src={restaurant.image_url} alt={restaurant.name} style={{ width: '100%', borderRadius: '5px' }} />
            <h2 style={{ marginTop: '20px' }}>詳細情報</h2>
            <p><strong>評価:</strong> {restaurant.rating}</p>
            <p><strong>説明:</strong> {restaurant.description}</p>
            <p><strong>住所:</strong> {restaurant.address}</p>
            <p><strong>電話番号:</strong> {restaurant.phone}</p>
            <Link href="/" style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                戻る
            </Link>
        </div>
    );
};

export default RestaurantDetail; 