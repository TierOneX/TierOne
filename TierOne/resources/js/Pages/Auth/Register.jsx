import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthToggle from "@/Components/Auth/AuthToggle";
import RegisterHeroPanel from "@/Components/Auth/RegisterHeroPanel";
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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPwd, setShowPwd] = useState(false);
    const [showPwdC, setShowPwdC] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout
            brandContent={<RegisterHeroPanel />}
            toggleSlot={<AuthToggle active="register" />}
            reverse={true}
        >
            <Head title="Crear Cuenta" />

            <form onSubmit={submit} className="space-y-5">
                {/* Username */}
                <div>
                    <InputLabel
                        htmlFor="username"
                        value="Nombre de Usuario"
                        className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
                    />
                    <TextInput
                        id="username"
                        name="username"
                        value={data.username}
                        className="mt-2 block w-full py-3.5 px-4"
                        autoComplete="username"
                        placeholder="tu_gamertag"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                    />
                    <InputError
                        message={errors.username}
                        className="mt-1.5 text-[10px] font-semibold uppercase"
                    />
                </div>

                {/* Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full py-3.5 px-4"
                        autoComplete="email"
                        placeholder="tu@email.com"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError
                        message={errors.email}
                        className="mt-1.5 text-[10px] font-semibold uppercase"
                    />
                </div>

                {/* Password */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Contraseña"
                        className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
                    />
                    <div className="relative mt-2">
                        <TextInput
                            id="password"
                            type={showPwd ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full py-3.5 pl-4 pr-11"
                            autoComplete="new-password"
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

                {/* Confirm Password */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                        className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
                    />
                    <div className="relative mt-2">
                        <TextInput
                            id="password_confirmation"
                            type={showPwdC ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full py-3.5 pl-4 pr-11"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwdC((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e31837] transition-colors"
                        >
                            <EyeIcon open={showPwdC} />
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5 text-[10px] font-semibold uppercase"
                    />
                </div>

                {/* Submit */}
                <PrimaryButton
                    className="w-full py-4 mt-2"
                    disabled={processing}
                >
                    Crear Cuenta
                </PrimaryButton>

                {/* Login link */}
                <div className="pt-4 border-t border-white/[0.06] text-center">
                    <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-[0.15em]">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            href="/login"
                            className="text-[#e31837] font-black hover:text-white transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
