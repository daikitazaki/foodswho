"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RegisterRestaurant: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const { error } = await supabase
            .from('restaurants')
            .insert([{ name, description, image_url: imageUrl }]);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('レストランが登録されました！');
            setTimeout(() => {
                router.push('/'); // トップページに遷移
            }, 2000);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">レストラン登録</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">レストラン名:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1">説明:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="imageUrl" className="block mb-1">画像URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full">
                    登録
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>
    );
};

export default RegisterRestaurant; 