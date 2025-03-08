"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // 環境変数から取得
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // 環境変数から取得
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RestaurantDetail: React.FC = () => {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [restaurant, setRestaurant] = useState<any>(null); // レストランの状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理
    const [loading, setLoading] = useState<boolean>(true); // ローディング状態を管理

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (id) {
                try {
                    const { data, error: fetchError } = await supabase
                        .from('restaurants')
                        .select('*')
                        .eq('id', id) // UUIDを使用してレストランを取得
                        .single(); // 単一のレストランを取得

                    if (fetchError) throw fetchError; // エラーがあればスロー
                    setRestaurant(data); // 取得したレストランデータを状態に保存
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setError(err.message); // エラーメッセージを状態に保存
                    } else {
                        setError('Unknown error occurred'); // 不明なエラーの場合の処理
                    }
                } finally {
                    setLoading(false); // ローディング完了
                }
            }
        };

        fetchRestaurant(); // レストラン情報を取得
    }, [id]);

    if (loading) return <p>読み込み中...</p>; // データがまだ取得できていない場合
    if (error) return <p>エラー: {error}</p>; // エラーがあれば表示
    if (!restaurant) return <p>レストランが見つかりませんでした。</p>; // レストランが見つからない場合

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', color: '#ff6347' }}>レストラン詳細</h2>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>レストラン名:</label>
                <p style={{ margin: '5px 0' }}>{restaurant.name}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>説明:</label>
                <p style={{ margin: '5px 0' }}>{restaurant.description}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>画像URL:</label>
                <p style={{ margin: '5px 0' }}>{restaurant.image_url}</p>
            </div>
            <Link href="/" style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginBottom: '10px' }}>
                戻る
            </Link>
            <Link href={`/reserve/${id}`} style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
                予約する
            </Link>
        </div>
    );
};

export default RestaurantDetail; 