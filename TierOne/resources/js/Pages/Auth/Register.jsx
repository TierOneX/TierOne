import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthToggle from "@/Components/Login/AuthToggle";
import RegisterHeroPanel from "@/Components/Login/RegisterHeroPanel";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

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

            {/* Mobile heading */}
            <div className="md:hidden mb-6 text-center">
                <h1 className="text-2xl font-black uppercase italic tracking-[0.08em] text-white">
                    CREAR <span className="text-[#e31837]">CUENTA</span>
                </h1>
            </div>

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
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full py-3.5 px-4"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData("password", e.target.value)}
                    />
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
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full py-3.5 px-4"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
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
                            className="text-[#e31837] font-bold hover:text-white transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
