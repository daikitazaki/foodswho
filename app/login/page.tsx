"use client";

import React, { useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';
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
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const session = supabase.auth.getSession();
        session.then(({ data }) => {
            setUser(data.session?.user || null);
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
        <div className="p-4 max-w-md mx-auto border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">ログイン</h2>
            {user ? (
                <div>
                    <p>ようこそ、{user.email}さん！</p>
                    <button onClick={handleLogout} className="bg-red-500 text-white rounded p-2 w-full">
                        ログアウト
                    </button>
                </div>
            ) : (
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">メールアドレス:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1">パスワード:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full">
                        ログイン
                    </button>
                </form>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <p className="mt-4">
                アカウントをお持ちですか？ <Link href="/register" className="text-blue-500">新規登録</Link>
            </p>
        </div>
    );
};

export default LoginPage; 