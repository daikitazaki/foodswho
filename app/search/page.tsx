"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
interface Restaurant {
    id: string;
    name: string;
    description: string;
    image_url: string;
}

const SearchPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('*');

                if (error) throw new Error(error.message); // エラーがあればスロー

                setRestaurants(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); // エラーメッセージを状態に保存
                } else {
                    setError('不明なエラーが発生しました。'); // その他のエラー処理
                }
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">レストラン検索</h1>
            <input
                type="text"
                placeholder="レストラン名で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-4 w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
            {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                    <div key={restaurant.id} className="border border-gray-300 rounded p-4 mb-4">
                        <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                        <p>{restaurant.description}</p>
                        <Link href={`/restaurant/${restaurant.id}`} className="text-blue-500">詳細を見る</Link>
                    </div>
                ))
            ) : (
                <p>レストランが見つかりませんでした。</p>
            )}
        </div>
    );
};

export default SearchPage; 