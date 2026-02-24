import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
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

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Acceso al Sistema" />

            <div className="mb-12 text-center">
                <h1 className="text-3xl font-black text-white tracking-[0.1em] uppercase italic">
                    ACCESO AL <span className="text-[#e31837]">SISTEMA</span>
                </h1>
                <p className="text-gray-600 text-[10px] mt-3 uppercase tracking-[0.3em] font-bold">
                    Terminal Operativa de TierOne
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-lg bg-green-500/10 p-4 text-center text-[10px] font-black text-green-500 border border-green-500/20 uppercase tracking-widest">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-8">
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email / Usuario"
                        className="text-[10px] tracking-[0.3em] text-gray-500 mb-2"
                    />

                    <div className="relative group">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full pl-4 py-3 sm:py-4"
                            autoComplete="username"
                            placeholder="tu@email.com"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </div>

                    <InputError
                        message={errors.email}
                        className="mt-2 text-[10px] font-bold uppercase"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="text-[10px] tracking-[0.3em] text-gray-500"
                        />
                        {canResetPassword && (
                            <Link
                                href="/forgot-password"
                                className="text-[8px] font-black text-[#e31837]/60 hover:text-[#e31837] transition-colors uppercase tracking-[0.2em]"
                            >
                                ¿La olvidaste?
                            </Link>
                        )}
                    </div>

                    <div className="relative group">
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pl-4 py-3 sm:py-4"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                    </div>

                    <InputError
                        message={errors.password}
                        className="mt-2 text-[10px] font-bold uppercase"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-[10px] font-black text-gray-600 group-hover:text-gray-400 transition-colors uppercase tracking-[0.2em]">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="pt-4">
                    <PrimaryButton
                        className="w-full py-5 text-sm"
                        disabled={processing}
                    >
                        Entrar ahora
                    </PrimaryButton>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                        ¿Sin perfil operativo?{" "}
                        <Link
                            href="/register"
                            className="text-[#e31837] font-black hover:text-white transition-colors underline underline-offset-4 decoration-2"
                        >
                            Inicializar Registro
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
