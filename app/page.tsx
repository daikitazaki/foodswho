"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // 環境変数から取得
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // 環境変数から取得
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Page: React.FC = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]); // 店舗の状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data: fetchedRestaurants, error: fetchError } = await supabase.from('restaurants').select('*');
                if (fetchError) throw fetchError; // エラーがあればスロー
                setRestaurants(fetchedRestaurants); // 取得した店舗データを状態に保存
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message); // エラーメッセージを状態に保存
                } else {
                    setError('Unknown error occurred'); // 不明なエラーの場合の処理
                }
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0' }}>
            {/* ヘッダー */}
            <header style={{ backgroundColor: '#ff6347', padding: '20px', color: '#fff', textAlign: 'center' }}>
                <h1>グルメサイト</h1>
                <nav>
                    <a href="#" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none' }}>ホーム</a>
                    <a href="#" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none' }}>おすすめ</a>
                    <a href="#" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none' }}>レビュー</a>
                    <a href="#" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none' }}>お問い合わせ</a>
                    <button style={{ margin: '0 10px', padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        新規登録
                    </button>
                    <button style={{ margin: '0 10px', padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        ログイン
                    </button>
                </nav>
            </header>

            {/* メインビジュアル */}
            <div style={{ backgroundImage: 'url(/path/to/your/image.jpg)', height: '300px', backgroundSize: 'cover', textAlign: 'center', color: '#fff', padding: '100px 20px' }}>
                <h2>あなたの次の食事を見つけよう</h2>
                <input type="text" placeholder="レストランや料理を検索" style={{ padding: '10px', width: '300px', borderRadius: '5px' }} />
            </div>

            {/* 店舗リスト */}
            <main style={{ padding: '20px' }}>
                <h2>おすすめのレストラン</h2>
                {error && <p style={{ color: 'red' }}>エラー: {error}</p>} {/* エラーがあれば表示 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {restaurants.length > 0 ? (
                        restaurants.map((restaurant) => (
                            <div key={restaurant.id} style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                                <img src={restaurant.image_url} alt={restaurant.name} style={{ width: '100%', borderRadius: '5px' }} />
                                <h3>{restaurant.name}</h3>
                                <p>評価: {restaurant.rating}</p>
                                <p>{restaurant.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>データがありません。</p>
                    )}
                </div>
            </main>

            {/* フッター */}
            <footer style={{ backgroundColor: '#ff6347', padding: '20px', color: '#fff', textAlign: 'center' }}>
                <p>© 2023 グルメサイト. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Page;
