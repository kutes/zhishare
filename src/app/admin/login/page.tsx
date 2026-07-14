"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/security/TurnstileWidget";
import { verifyTurnstileTokenOnClient } from "@/lib/security/turnstile-client";
import {
  getSupabaseBrowserClient,
  getSupabaseUserWithTimeout,
  isSupabaseAuthSessionMissing,
} from "@/lib/supabase/client";

type LoginStatus = "idle" | "checking" | "submitting";

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<LoginStatus>("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("idle");
      setErrorMessage("Supabase 配置缺失，暂时无法登录后台。");
      return;
    }

    getSupabaseUserWithTimeout(supabase)
      .then(({ data, error }) => {
        if (!mounted) {
          return;
        }

        if (error && !isSupabaseAuthSessionMissing(error)) {
          console.error("[Admin Login] getUser", error);
        }

        if (data.user) {
          router.replace("/admin");
          return;
        }

        const next = new URLSearchParams(window.location.search).get("next");

        if (next === "admin") {
          setErrorMessage("请先登录后再进入后台。");
        }

        setStatus("idle");
      })
      .catch((error) => {
        console.error("[Admin Login] getUser rejected", error);

        if (!mounted) {
          return;
        }

        setErrorMessage("登录状态检查超时，可以直接填写账号登录。");
        setStatus("idle");
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setErrorMessage("请填写邮箱和密码。");
      return;
    }

    if (!turnstileToken) {
      setErrorMessage("请先完成人机验证。");
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage("Supabase 配置缺失，暂时无法登录后台。");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const isVerified = await verifyTurnstileTokenOnClient(turnstileToken);

    if (!isVerified) {
      setErrorMessage("人机验证失败，请刷新后重试。");
      turnstileRef.current?.reset();
      setStatus("idle");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Admin Login] signInWithPassword", error);
      setErrorMessage("登录失败，请检查邮箱和密码。");
      turnstileRef.current?.reset();
      setStatus("idle");
      return;
    }

    router.replace("/admin");
  }

  const isBusy = status === "checking" || status === "submitting";

  return (
    <main className="admin-theme min-h-screen overflow-hidden bg-[#faf6f0]">
      <section className="section-gradient-blue min-h-screen">
        <div className="page-shell flex min-h-screen items-center justify-center py-12">
          <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="glass-card p-6 sm:p-8">
              <div className="inline-flex rounded-full border border-sky-200/80 bg-white/65 px-4 py-2 text-xs font-bold text-sky-700 shadow-sm backdrop-blur">
                后台入口
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
                登录知享后台
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600">
                当前阶段只开放邮箱密码登录，用于查看后台首页统计。后续再逐步增加内容管理、投稿审核和投诉处理。
              </p>
              <div className="mt-7 grid gap-3 text-sm text-slate-600">
                {["只做管理员登录", "不做多角色权限", "不暴露敏感密钥"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card-strong p-6 sm:p-8" aria-labelledby="admin-login-title">
              <p className="text-sm font-bold text-sky-700">管理员登录</p>
              <h2 id="admin-login-title" className="mt-3 text-2xl font-black text-ink">
                使用 Supabase Auth 邮箱密码登录
              </h2>

              {errorMessage ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-semibold leading-7 text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {status === "checking" ? (
                <div className="mt-6 rounded-2xl border border-white/70 bg-white/60 px-4 py-5 text-sm font-semibold text-slate-600">
                  正在检查登录状态...
                </div>
              ) : (
                <form className="mt-6 grid gap-5" method="post" onSubmit={handleSubmit} noValidate>
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    登录邮箱
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@example.com"
                      className="min-h-12 rounded-2xl border border-white/75 bg-white/75 px-4 text-base font-medium text-ink shadow-inner outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    登录密码
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="请输入密码"
                      className="min-h-12 rounded-2xl border border-white/75 bg-white/75 px-4 text-base font-medium text-ink shadow-inner outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </label>

                  <TurnstileWidget
                    ref={turnstileRef}
                    onTokenChange={setTurnstileToken}
                    className="rounded-2xl border border-white/75 bg-white/55 px-4 py-3 shadow-sm"
                  />

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="min-h-12 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_24px_60px_rgba(15,23,42,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {status === "submitting" ? "登录中..." : "登录后台"}
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
