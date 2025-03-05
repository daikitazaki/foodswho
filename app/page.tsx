"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabaseのクライアントを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // 環境変数から取得
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // 環境変数から取得
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Page: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // データの状態を管理
    const [error, setError] = useState<string | null>(null); // エラーの状態を管理

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: fetchedData, error: fetchError } = await supabase.from('users').select('*');
                if (fetchError) throw fetchError; // エラーがあればスロー
                setData(fetchedData); // 取得したデータを状態に保存
                console.log('Fetched data:', fetchedData); // データをコンソールに表示
            } catch (err: unknown) { // errの型をunknownに指定
                if (err instanceof Error) {
                    setError(err.message); // エラーメッセージを状態に保存
                } else {
                    setError('Unknown error occurred'); // 不明なエラーの場合の処理
                }
                console.error('Error fetching data:', err); // エラーをコンソールに表示
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>ユーザーデータ</h1>
            {error && <p style={{ color: 'red' }}>エラー: {error}</p>} {/* エラーがあれば表示 */}
            {data.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>名前</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>メール</th>
                            {/* 他のカラムも必要に応じて追加 */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.email}</td>
                                {/* 他のカラムも必要に応じて表示 */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>データがありません。</p>
            )}
        </div>
    );
};

export default Page;
