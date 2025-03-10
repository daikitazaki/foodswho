"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // CSSをインポート
import Cookies from 'js-cookie'; // js-cookieをインポート
import { createClient } from '@supabase/supabase-js'; // Supabaseをインポート

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ReservePage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const router = useRouter();

    const [username, setUsername] = useState<string | null>(null); // ユーザー名の状態を管理
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 選択された日時の状態を管理
    const [error, setError] = useState<string | null>(null); // エラーメッセージの状態を管理
    const [success, setSuccess] = useState<string | null>(null); // 成功メッセージの状態を管理
    const [user, setUser] = useState<any>(null); // ユーザー情報の状態を管理

    useEffect(() => {
        const session = supabase.auth.getSession(); // セッションを取得
        session.then(({ data }) => {
            setUser(data.session?.user); // ユーザー情報を設定
        });

        // クッキーからユーザー名を取得
        const storedName = Cookies.get('username'); // クッキーから取得
        if (storedName) {
            setUsername(storedName); // 登録時に入力したユーザー名を設定
        }
    }, []);

    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!user) {
            setError('ユーザーがログインしていません。'); // ユーザーがログインしていない場合のエラーメッセージ
            return;
        }

        console.log('登録する予約情報:', { user_id: user.id, restaurant_id: id, datetime: selectedDate }); // デバッグ用

        const { error } = await supabase
            .from('reservations')
            .insert([{ user_id: user.id, restaurant_id: id, datetime: selectedDate }]);

        if (error) {
            console.error('Error inserting reservation:', error); // エラーをコンソールに表示
            setError(error.message || '予約の挿入中にエラーが発生しました。'); // エラーメッセージを表示
        } else {
            setSuccess('予約が登録されました！'); // 成功メッセージを表示
            setTimeout(() => {
                router.push('/'); // トップページに遷移
            }, 2000);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', color: '#ff6347' }}>予約ページ</h2>
            {username && <p>ログイン中のユーザー: {username}</p>}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>予約日時:</label>
                <div style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        placeholderText="日時を選択"
                    />
                </div>
            </div>
            <button onClick={handleReserve} style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                予約する
            </button>
            <Link href={`/restaurant/${id}`} style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginLeft: '10px' }}>
                戻る
            </Link>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージを表示 */}
            {success && <p style={{ color: 'green' }}>{success}</p>} {/* 成功メッセージを表示 */}
        </div>
    );
};

export default ReservePage; 