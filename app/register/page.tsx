"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [user, setUser] = useState<any>(null); // ユーザーの状態を管理
    const router = useRouter();

    useEffect(() => {
        const session = supabase.auth.getSession(); // セッションを取得
        session.then(({ data }) => {
            setUser(data.session?.user); // ユーザー情報を設定
        });
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // ユーザー登録
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error("Registration error:", error);
            if (error.message.includes("too many requests")) {
                setError("リクエストが多すぎます。しばらく待ってから再試行してください。");
            } else {
                setError(error.message);
            }
        } else {
            // ユーザー情報をデータベースに保存
            const { error: profileError } = await supabase
                .from('users')
                .insert([{ id: data.user?.id, name }]);

            if (profileError) {
                console.error("Profile insertion error:", profileError);
                setError(profileError.message);
            } else {
                setSuccess('登録が成功しました！');
                console.log(data.user);
                await router.push('/'); // トップページに遷移
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px' }}>
            <header style={{ backgroundColor: '#ff6347', padding: '20px', textAlign: 'center' }}>
                <h1 style={{ margin: '0', fontSize: '2em', color: '#fff' }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>FOOD'sWho</Link>
                </h1>
            </header>

            <h2 style={{ marginTop: '20px' }}>新規登録</h2>
            {user ? ( // ユーザーが認証されている場合
                <p>すでに登録されています。</p>
            ) : (
                <form onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="name">名前:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ff6347', borderRadius: '5px' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">メールアドレス:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ff6347', borderRadius: '5px' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">パスワード:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ff6347', borderRadius: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        登録
                    </button>
                </form>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* フッター */}
            <footer style={{ backgroundColor: '#ff6347', padding: '20px', color: '#fff', textAlign: 'center', marginTop: '20px' }}>
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

export default RegisterPage; 