
'use client';
import Link from "next/link"
import * as React from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (!authLoading && user) {
        router.push("/home");
        }
    }, [user, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            // 1. Find user by username to get their email
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username.toLowerCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("auth/user-not-found");
            }
            
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const email = userData.email;

            if (!email) {
                 throw new Error("auth/invalid-email");
            }

            // 2. Sign in with the retrieved email and provided password
            await signInWithEmailAndPassword(auth, email, password);
            
            toast({
                title: "Login Berhasil",
                description: "Anda akan diarahkan ke halaman utama.",
            });
            router.push("/home");

        } catch (err: any) {
             let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
             switch (err.message) {
                 case "auth/user-not-found":
                     errorMessage = "Nama pengguna tidak ditemukan.";
                     break;
                 case "auth/invalid-credential":
                     errorMessage = "Nama pengguna atau kata sandi salah.";
                     break;
                 case "auth/invalid-email":
                      errorMessage = "Akun ini tidak memiliki email yang valid.";
                      break;
                 default:
                    if (err.code === 'auth/invalid-credential') {
                        errorMessage = "Nama pengguna atau kata sandi salah.";
                    }
                    break;
             }
            setError(errorMessage);
            toast({
                title: "Login Gagal",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    
    if (authLoading || (!authLoading && user)) {
        return (
             <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        )
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center pt-6">Manajemen Pelanggan</CardTitle>
          <CardDescription className="text-center">
            Selamat datang! Masuk untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                type="text"
                placeholder="cth. budi"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Kata Sandi</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Masuk'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/signup" className="underline">
              Daftar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
