import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import BrandHeading from "@/Components/Login/BrandHeading";
import AuthToggle from "@/Components/Login/AuthToggle";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

const EyeIcon = ({ open }) =>
    open ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
        </svg>
    );

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const [showPwd, setShowPwd] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post("/login", { onFinish: () => reset("password") });
    };

    return (
        <GuestLayout
            brandContent={<BrandHeading />}
            toggleSlot={<AuthToggle active="login" />}
        >
            <Head title="Acceso al Sistema" />

            {/* Mobile heading */}
            <div className="md:hidden mb-6 text-center">
                <h1 className="text-2xl font-black uppercase italic tracking-[0.08em] text-white">
                    ACCESO AL <span className="text-[#e31837]">SISTEMA</span>
                </h1>
            </div>

            {status && (
                <div className="mb-5 rounded-lg bg-green-500/10 p-3 text-center text-[10px] font-bold text-green-400 border border-green-500/20 uppercase tracking-widest">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email / Usuario"
                        className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full py-3.5 px-4"
                        autoComplete="username"
                        placeholder="tu@email.com"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError
                        message={errors.email}
                        className="mt-1.5 text-[10px] font-semibold uppercase"
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
                        />
                        {canResetPassword && (
                            <Link
                                href="/forgot-password"
                                className="text-[9px] font-bold text-[#e31837]/50 hover:text-[#e31837] transition-colors uppercase tracking-[0.15em]"
                            >
                                ¿Olvidaste la contraseña?
                            </Link>
                        )}
                    </div>
                    <div className="relative mt-2">
                        <TextInput
                            id="password"
                            type={showPwd ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full py-3.5 pl-4 pr-11"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e31837] transition-colors"
                        >
                            <EyeIcon open={showPwd} />
                        </button>
                    </div>
                    <InputError
                        message={errors.password}
                        className="mt-1.5 text-[10px] font-semibold uppercase"
                    />
                </div>

                {/* Remember */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                    <span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-[0.2em]">
                        Recordarme
                    </span>
                </label>

                {/* Submit */}
                <PrimaryButton
                    className="w-full py-4 mt-2"
                    disabled={processing}
                >
                    Entrar
                </PrimaryButton>

                {/* Register link */}
                <div className="pt-4 border-t border-white/[0.06] text-center">
                    <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-[0.15em]">
                        ¿Aún no tienes cuenta?{" "}
                        <Link
                            href="/register"
                            className="text-[#e31837] font-bold hover:text-white transition-colors"
                        >
                            Regístrate
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
