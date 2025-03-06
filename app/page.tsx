"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // 環境変数から取得
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // 環境変数から取得
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Page: React.FC = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]); // 店舗の状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理
    const [searchTerm, setSearchTerm] = useState<string>(''); // 検索用の状態を管理

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

    // スライダーの設定
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0' }}>
            {/* ヘッダー */}
            <header style={{ backgroundColor: '#ff7f50', padding: '30px', color: '#fff', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3em', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', margin: '0' }}>FOOD'sWho</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                    <input
                        type="text"
                        placeholder="レストランや料理を検索"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', width: '300px', borderRadius: '5px', marginRight: '10px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                    />
                    <button style={{ padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', transition: 'background-color 0.3s, transform 0.3s' }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffe4e1'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                        新規登録
                    </button>
                    <button style={{ padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s, transform 0.3s' }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffe4e1'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                        ログイン
                    </button>
                </div>
            </header>

            {/* メインビジュアル */}
            <div style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)', height: '300px', backgroundSize: 'cover', textAlign: 'center', color: '#fff', padding: '100px 20px', position: 'relative' }}>
                <h2 style={{ fontSize: '3em', color: '#fff', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', fontWeight: 'bold' }}>あなたの次の食事を見つけよう</h2>
            </div>

            {/* セクション1: おすすめレストラン */}
            <section style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>おすすめのレストラン</h2>
                {error && <p style={{ color: 'red' }}>エラー: {error}</p>} {/* エラーがあれば表示 */}
                <Slider {...settings}>
                    {restaurants.length > 0 && restaurants.map((restaurant) => (
                        <div key={restaurant.id} style={{ padding: '10px' }}>
                            <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', width: '200px' }}>
                                <img src={restaurant.image_url} alt={restaurant.name} style={{ width: '100%', borderRadius: '5px' }} />
                                <h3>{restaurant.name}</h3>
                                <p>評価: {restaurant.rating}</p>
                                <p>{restaurant.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            {/* セクション2: 新着レストラン */}
            <section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>新着レストラン</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/new-restaurant-image1.jpg" alt="新着レストラン1" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>新着レストラン1</h3>
                        <p>新しい料理が楽しめるお店です。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/new-restaurant-image2.jpg" alt="新着レストラン2" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>新着レストラン2</h3>
                        <p>新しいメニューが追加されました。</p>
                    </div>
                </div>
            </section>

            {/* セクション3: 人気料理 */}
            <section style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>人気料理</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/popular-dish-image1.jpg" alt="人気料理1" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>人気料理1</h3>
                        <p>この料理は多くの人に愛されています。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/popular-dish-image2.jpg" alt="人気料理2" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>人気料理2</h3>
                        <p>特製ソースが絶品です。</p>
                    </div>
                </div>
            </section>

            {/* セクション4: 特集記事 */}
            <section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>特集記事</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/featured-article-image1.jpg" alt="特集記事1" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>特集記事タイトル1</h3>
                        <p>特集記事の簡単な説明文がここに入ります。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/featured-article-image2.jpg" alt="特集記事2" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>特集記事タイトル2</h3>
                        <p>特集記事の簡単な説明文がここに入ります。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src="/path/to/featured-article-image3.jpg" alt="特集記事3" style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>特集記事タイトル3</h3>
                        <p>特集記事の簡単な説明文がここに入ります。</p>
                    </div>
                </div>
            </section>

            {/* セクション5: ユーザーレビュー */}
            <section style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>ユーザーレビュー</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <h3>ユーザー名1</h3>
                        <p>評価: ★★★★☆</p>
                        <p>このレストランは素晴らしい食事を提供してくれました！</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <h3>ユーザー名2</h3>
                        <p>評価: ★★★★★</p>
                        <p>サービスがとても良く、また訪れたいです。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <h3>ユーザー名3</h3>
                        <p>評価: ★★★☆☆</p>
                        <p>料理は美味しかったですが、待ち時間が長かったです。</p>
                    </div>
                </div>
            </section>

            {/* フッター */}
            <footer style={{ backgroundColor: '#ff7f50', padding: '20px', color: '#fff', textAlign: 'center' }}>
                <h3 style={{ margin: '10px 0' }}>私たちのこと</h3>
                <p style={{ margin: '10px 0' }}>FOOD'sWhoは、あなたの次の食事を見つけるためのグルメサイトです。美味しいレストランを見つけて、素敵な食事を楽しんでください。</p>
                <p style={{ margin: '10px 0' }}>フォローしてね！</p>
                <div>
                    <a href="#" style={{ color: '#fff', margin: '0 10px' }}>Facebook</a>
                    <a href="#" style={{ color: '#fff', margin: '0 10px' }}>Twitter</a>
                    <a href="#" style={{ color: '#fff', margin: '0 10px' }}>Instagram</a>
                </div>
                <p style={{ margin: '10px 0' }}>© 2023 グルメサイト. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Page;
