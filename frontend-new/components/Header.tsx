'use client';
import Link from 'next/link';

type HeaderProps = {
    logoSize?: 'small' | 'medium' | 'large';
};

export default function Header({ logoSize = 'medium' }: HeaderProps) {
    // Map sizes to Tailwind CSS classes
    const logoClass = {
        small: 'h-8',
        medium: 'h-12',
        large: 'h-20',
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <div className="flex items-center">
                <img
                    src="/massimo-logo.png"
                    alt="Massimo Logo"
                    className={`${logoClass[logoSize]} mr-4`}
                />
                <nav>
                    <Link href="/about" className="mr-4 text-gray-600 hover:text-black">
                        About Us
                    </Link>
                </nav>
            </div>
            <div className="flex items-center">
                <img
                    src="/user-avatar.png"
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full mr-2"
                />
                <span className="text-gray-700">Username</span>
            </div>
        </header>
    );
}

