"use client";

import React, { useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // 環境変数から取得
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // 環境変数から取得
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
interface Restaurant {
    id: string;
    name: string;
    description: string;
    image_url: string;
}

interface Review {
    id: string;
    title: string;
    content: string;
    username: string;
}

interface Reservation {
    id: string;
    user_id: string;
    restaurant_id: string;
    datetime: string;
    restaurants: {
        name: string;
    };
}

const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleString('ja-JP', options); // 日本語形式でフォーマット
};

const Page: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // 店舗の状態を管理
    const [newRestaurants, setNewRestaurants] = useState<Restaurant[]>([]); // 新着レストランの状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理
    const [searchTerm, setSearchTerm] = useState<string>(''); // 検索用の状態を管理
    const [category, setCategory] = useState<string | null>(null); // カテゴリーの状態を管理
    const [user, setUser] = useState<User | null>(null); // ユーザーの状態を管理
    const [menuOpen, setMenuOpen] = useState<boolean>(false); // メニューの開閉状態
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]); // レビューの状態を管理
    const [reservations, setReservations] = useState<Reservation[]>([]); // 予約情報の状態を管理


    useEffect(() => {
        const fetchRestaurants = async () => {
            const { data: fetchedRestaurants, error: fetchError } = await supabase.from('restaurants').select('*');
            if (fetchError) {
                setError(fetchError.message); // エラーメッセージを状態に保存
            } else {
                setRestaurants(fetchedRestaurants); // 取得した店舗データを状態に保存
            }
        };

        const fetchNewRestaurants = async () => {
            const { data: fetchedNewRestaurants, error: fetchError } = await supabase
                .from('restaurants')
                .select('id, name, description, image_url') // 必要なカラムを指定
                .order('created_at', { ascending: false }) // 新着順に取得
                .limit(5); // 取得するレストランの数を制限

            if (fetchError) {
                setError(fetchError.message); // エラーメッセージを状態に保存
            } else {
                setNewRestaurants(fetchedNewRestaurants); // 新着レストランを状態に保存
            }
        };

        const fetchReviews = async () => {
            const { data, error: fetchError } = await supabase
                .from('reviews') // 'reviews'テーブルから取得
                .select('*'); // タイトルと内容を取得

            if (fetchError) {
                setError(fetchError.message); // エラーメッセージを状態に保存
            } else {
                setReviews(data); // 取得したレビューを状態に保存
            }
        };

        async function fetchReservation() {
            const { data: userData } = await supabase.auth.getUser(); // 現在のユーザーを取得
            const user = userData?.user; // ユーザー情報を取得

            if (user) {
                const { data, error } = await supabase
                    .from("reservations") // 予約テーブルの名前
                    .select("*, restaurants(name)") // すべてのカラムとレストラン名を取得
                    .eq("user_id", user.id); // ログインユーザーの予約を取得

                if (error) {
                    setError(error.message || '予約情報の取得中にエラーが発生しました。'); // エラーメッセージを表示
                } else {
                    setReservations(data); // 取得した予約情報を状態に保存
                }
            }
        }

        const session = supabase.auth.getSession(); // セッションを取得
        session.then(({ data }) => {
            setUser(data.session?.user || null);
        });

        fetchRestaurants();
        fetchNewRestaurants(); // 新着レストランを取得
        fetchReviews(); // レビュー情報を取得
        fetchReservation(); // 予約情報を取得
    }, []); // 依存配列は空にして、コンポーネントのマウント時にのみ実行

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(error.message);
        } else {
            setUser(null); // ユーザー情報をリセット
        }
    };

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
            <header style={{ backgroundColor: '#ff7f50', padding: '30px', color: '#fff', textAlign: 'center', position: 'relative' }}>
                <h1 style={{ fontSize: '3em', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', margin: '0' }}>Pick App</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                    <input
                        type="text"
                        placeholder="レストランや料理を検索"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', width: '300px', borderRadius: '5px', marginRight: '10px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                    />
                    <select
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
                    <button onClick={() => router.push(`/search?query=${searchTerm}&category=${category}`)} style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        検索
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '15px', position: 'absolute', right: '30px', top: '30px' }}>
                    {!user && ( // ユーザーが認証されていない場合のみ表示
                        <button style={{ padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', transition: 'background-color 0.3s, transform 0.3s' }} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffe4e1'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                            <Link href="/register">新規登録</Link>
                        </button>
                    )}
                    {!user && ( // ユーザーが認証されていない場合のみ表示
                        <button style={{ padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s, transform 0.3s' }} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffe4e1'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                            <Link href="/login" style={{ color: '#ff6347', textDecoration: 'none' }}>ログイン</Link>
                        </button>
                    )}
                    {user && (
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: '10px 15px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                アカウント
                            </button>
                            {menuOpen && (
                                <div style={{ position: 'absolute', right: 0, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 100 }}>
                                    <div style={{ padding: '10px', color: '#000' }}>
                                        <p>予約一覧:</p>
                                        {reservations.length > 0 ? (
                                            reservations.map((reservation) => (
                                                <div key={reservation.id} style={{ marginBottom: '20px' }}>
                                                    <p style={{ margin: 0 }}>レストラン名: {reservation.restaurants?.name || "不明なレストラン"}</p>
                                                    <p style={{ margin: 0 }}>予約日時: {formatDateTime(reservation.datetime)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>予約はありません。</p>
                                        )}
                                        <p onClick={handleLogout} style={{ padding: '10px', margin: 0, cursor: 'pointer', color: '#ff6347' }}>
                                            ログアウト
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                                <Link href={`/restaurant/${restaurant.id}`}>
                                    <h3 style={{ color: '#ff6347', textDecoration: 'none' }}>{restaurant.name}</h3>
                                </Link>
                                <p>{restaurant.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
                {!user && ( // ユーザーがログインしていない場合のメッセージ
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link href="/login">
                            <button style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                まずは登録・ログインから！
                            </button>
                        </Link>
                    </div>
                )}
            </section>

            {/* 新着レストランの表示 */}
            <section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>新着レストラン</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {newRestaurants.length > 0 && newRestaurants.map((restaurant) => (
                        <div key={restaurant.id} style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                            <Link href={`/restaurant/${restaurant.id}`}>
                                <h3 style={{ color: '#ff6347', textDecoration: 'none' }}>{restaurant.name}</h3>
                            </Link>
                            <p>{restaurant.description}</p>
                        </div>
                    ))}
                </div>
                {!user && ( // ユーザーがログインしていない場合のメッセージ
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link href="/login">
                            <button style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                まずは登録・ログインから！
                            </button>
                        </Link>
                    </div>
                )}
            </section>

            {/* レストラン登録ボタン */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <button
                    onClick={() => {
                        if (!user) {
                            router.push('/login'); // ユーザーがログインしていない場合はログインページに遷移
                        } else {
                            router.push('/register-restaurant'); // ユーザーがログインしている場合はレストラン登録ページに遷移
                        }
                    }}
                    style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    レストランの登録はこちら
                </button>
            </div>

            {/* セクション3: 人気料理 */}
            <section style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>人気料理</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <h3>人気料理1</h3>
                        <p>この料理は多くの人に愛されています。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
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
                        <h3>特集記事タイトル1</h3>
                        <p>特集記事の簡単な説明文がここに入ります。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <h3>特集記事タイトル2</h3>
                        <p>特集記事の簡単な説明文がここに入ります。</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width: '200px' }}>
                        <h3>特集記事タイトル3</h3>
                        <p>特集記事の簡単な説明文がここに入ります。</p>
                    </div>
                </div>
            </section>

            {/* セクション5: ユーザーレビュー */}
            <section style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>ユーザーレビュー</h2>
                {error && <p style={{ color: 'red' }}>エラー: {error}</p>} {/* エラーがあれば表示 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px' }}>
                                <h3>{review.title}</h3>
                                <p>{review.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>レビューはありません。</p>
                    )}
                </div>
                {!user && ( // ユーザーがログインしていない場合のメッセージ
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link href="/login">
                            <button style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                まずは登録・ログインから！
                            </button>
                        </Link>
                    </div>
                )}
            </section>

            {/* フッター */}
            <footer style={{ backgroundColor: '#ff7f50', padding: '20px', color: '#fff', textAlign: 'center' }}>
                <h3 style={{ margin: '10px 0' }}>私たちのこと</h3>
                <p style={{ margin: '10px 0' }}>FOOD&apos;sWhoは、あなたの次の食事を見つけるためのグルメサイトです。美味しいレストランを見つけて、素敵な食事を楽しんでください。</p>
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
