import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import BrandHeading from "@/Components/Login/BrandHeading";
import AuthToggle from "@/Components/Login/AuthToggle";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

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

            {/* Mobile heading — solo visible < md, en desktop lo muestra el panel izquierdo */}
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
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full py-3.5 px-4"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData("password", e.target.value)}
                    />
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
