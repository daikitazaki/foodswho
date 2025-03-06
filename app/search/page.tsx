"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SearchPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [restaurants, setRestaurants] = useState<any[]>([]); // 検索結果の状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理
    const [query, setQuery] = useState<string | null>(null); // 検索クエリの状態を管理
    const [category, setCategory] = useState<string | null>(null); // カテゴリーの状態を管理

    useEffect(() => {
        // URLから検索クエリを取得
        const queryParam = searchParams.get('query');
        const categoryParam = searchParams.get('category');

        if (queryParam) {
            setQuery(queryParam); // クエリを状態に設定
        }
        if (categoryParam) {
            setCategory(categoryParam); // カテゴリーを状態に設定
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (query || category) {
                const queryBuilder = supabase.from('restaurants').select('*');

                if (query) {
                    queryBuilder.ilike('name', `%${query}%`); // 名前に検索クエリを含むレストランを取得
                }

                if (category) {
                    queryBuilder.eq('category', category); // カテゴリーでフィルタリング
                }

                const { data, error } = await queryBuilder;

                if (error) {
                    setError(error.message);
                } else {
                    setRestaurants(data);
                }
            }
        };

        fetchRestaurants();
    }, [query, category]);

    if (error) {
        return <p style={{ color: 'red' }}>エラー: {error}</p>; // エラーがあれば表示
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px' }}>
            <h1 style={{ fontSize: '2.5em', color: '#ff6347' }}>検索結果</h1>
            <div>
                <label htmlFor="category">カテゴリー:</label>
                <select
                    id="category"
                    value={category || ''}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                    <option value="">すべてのカテゴリー</option>
                    <option value="和食">和食</option>
                    <option value="洋食">洋食</option>
                    <option value="中華">中華</option>
                    <option value="イタリアン">イタリアン</option>
                    <option value="カフェ">カフェ</option>
                    {/* 他のカテゴリーを追加 */}
                </select>
            </div>
            {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                    <div key={restaurant.id} style={{ marginBottom: '20px' }}>
                        <h2>{restaurant.name}</h2>
                        <p>評価: {restaurant.rating}</p>
                        <p>{restaurant.description}</p>
                    </div>
                ))
            ) : (
                <p>該当するレストランは見つかりませんでした。</p>
            )}
            <button onClick={() => window.history.back()} style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                戻る
            </button>
        </div>
    );
};

export default SearchPage; 