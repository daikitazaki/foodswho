"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // CSSをインポート
import Cookies from 'js-cookie'; // js-cookieをインポート

const ReservePage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const router = useRouter();

    const [username, setUsername] = useState<string | null>(null); // ユーザー名の状態を管理
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 選択された日時の状態を管理

    useEffect(() => {
        // クッキーからユーザー名を取得
        const storedName = Cookies.get('username'); // クッキーから取得
        if (storedName) {
            setUsername(storedName); // 登録時に入力したユーザー名を設定
        }
    }, []);

    const handleReserve = () => {
        // 日時が未入力の場合はアラートを表示
        if (!selectedDate) {
            alert('予約日時を選択してください。');
            return; // 処理を中断
        }

        // 予約処理を実装します
        console.log(`予約が完了しました: ${username}, 日時: ${selectedDate}`);
        
        // 予約情報をクッキーに保存
        const reservation = {
            username: username,
            date: selectedDate,
            restaurantId: id,
        };
        Cookies.set('reservation', JSON.stringify(reservation)); // 予約情報をクッキーに保存

        // 予約完了メッセージを表示
        alert(`予約が完了しました: ${username}, 日時: ${selectedDate}`);
        
        // トップページに遷移
        router.push('/'); // トップページに遷移
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
        </div>
    );
};

export default ReservePage; 