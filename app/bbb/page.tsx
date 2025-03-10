"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BbbPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/'); // トップページにリダイレクト
    }, [router]);

    return null; // 何も表示しない
};

export default BbbPage; 