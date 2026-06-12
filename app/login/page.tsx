'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate credentials (admin/123)
    if (username === 'admin' && password === '123') {
      // Set auth cookie
      document.cookie = 'auth_token=admin_token_valid; path=/; max-age=86400';
      router.push('/admin');
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-xl">🔐</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Đăng Nhập Quản Trị</CardTitle>
          <CardDescription className="text-center">
            Truy cập bảng điều khiển quản lý
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-foreground">
                Tên Đăng Nhập
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="border-border"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Mật Khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-border"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0"
            >
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-foreground/60 text-center mb-3">Thông Tin Demo:</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <p><strong>Tên Đăng Nhập:</strong> admin</p>
                <p><strong>Mật Khẩu:</strong> 123</p>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
              ← Quay Lại Trang Chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
