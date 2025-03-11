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
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '2px solid #ff6347', borderRadius: '10px' }}>
            <h2>レストラン登録</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">レストラン名:</label>
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
                    <label htmlFor="description">説明:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ff6347', borderRadius: '5px' }}
                    />
                </div>
                <div>
                    <label htmlFor="imageUrl">画像URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ff6347', borderRadius: '5px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    登録
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default RegisterRestaurant; 