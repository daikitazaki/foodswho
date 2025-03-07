"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const session = supabase.auth.getSession();
        session.then(({ data }) => {
            setUser(data.session?.user);
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess('ログインに成功しました！');
            console.log(data.user);
            await router.push('/');
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(error.message);
        } else {
            setUser(null);
            setSuccess('ログアウトしました。');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px' }}>
            <header style={{ backgroundColor: '#ff6347', padding: '20px', textAlign: 'center' }}>
                <h1 style={{ margin: '0', fontSize: '2em', color: '#fff' }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>FOOD'sWho</Link>
                </h1>
            </header>

            <h2 style={{ marginTop: '20px' }}>ログイン</h2>
            {user ? (
                <div>
                    <p>ようこそ、{user.email}さん！</p>
                    <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        ログアウト
                    </button>
                </div>
            ) : (
                <form onSubmit={handleLogin}>
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
                        ログイン
                    </button>
                </form>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <p>
                アカウントをお持ちでないですか？ <Link href="/register" style={{ color: '#ff6347' }}>新規登録</Link>
            </p>

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

export default LoginPage; 