"use client";

import { useState } from "react";

interface CheatsheetData {
  company_intel?: {
    culture_keywords?: string[];
    interview_style?: string;
    recent_focus?: string;
  };
  opening_pitch?: string;
  job_core_requirements?: { req: string; detail: string; weight: string }[];
  match_points?: { your_bg: string; connects_to: string; gap?: string }[];
  key_questions?: { q: string; type: string; angle: string; answer_frame: string }[];
  star_stories?: { title: string; s: string; t: string; a: string; r: string; use_for: string[] }[];
  questions_to_ask?: { q: string; why: string; timing?: string }[];
  danger_zones?: { zone: string; how_to_handle: string }[];
  custom_tips?: string[];
}

const TYPE_COLORS: Record<string, string> = {
  Behavioral: "bg-blue-100 text-blue-700",
  Case: "bg-purple-100 text-purple-700",
  Technical: "bg-green-100 text-green-700",
  Motivational: "bg-amber-100 text-amber-700",
};

function toPlainText(data: CheatsheetData, company: string, role: string) {
  const lines: string[] = [];
  lines.push("=".repeat(50));
  lines.push(`  面试小抄 · ${company} · ${role}`);
  lines.push(`  生成时间：${new Date().toLocaleString("zh-CN")}`);
  lines.push("=".repeat(50));

  const ci = data.company_intel;
  if (ci) {
    lines.push("\n【公司情报】");
    if (ci.culture_keywords?.length) lines.push(`  文化关键词：${ci.culture_keywords.join(" / ")}`);
    if (ci.interview_style) lines.push(`  面试风格：${ci.interview_style}`);
    if (ci.recent_focus) lines.push(`  近期关注：${ci.recent_focus}`);
  }

  lines.push(`\n${"─".repeat(50)}`);
  lines.push("【开场自我介绍 · 30秒版】");
  lines.push(data.opening_pitch || "");

  lines.push(`\n${"─".repeat(50)}`);
  lines.push("【岗位核心要求】");
  data.job_core_requirements?.forEach((r, i) => {
    lines.push(`  ${i + 1}. ${r.req} [${r.weight}]`);
    lines.push(`     → ${r.detail}`);
  });

  lines.push(`\n${"─".repeat(50)}`);
  lines.push("【你的核心匹配点】");
  data.match_points?.forEach((mp) => {
    lines.push(`  ▸ ${mp.your_bg}`);
    lines.push(`    对应：${mp.connects_to}`);
    if (mp.gap) lines.push(`    补短：${mp.gap}`);
  });

  lines.push(`\n${"─".repeat(50)}`);
  lines.push("【高频预测题】");
  data.key_questions?.forEach((q, i) => {
    lines.push(`  Q${i + 1}. ${q.q} [${q.type}]`);
    lines.push(`      考察：${q.angle}`);
    lines.push(`      答法：${q.answer_frame}\n`);
  });

  lines.push(`${"─".repeat(50)}`);
  lines.push("【STAR 故事库】");
  data.star_stories?.forEach((s) => {
    lines.push(`\n  ▸ ${s.title}`);
    lines.push(`    S: ${s.s}`);
    lines.push(`    T: ${s.t}`);
    lines.push(`    A: ${s.a}`);
    lines.push(`    R: ${s.r}`);
    lines.push(`    适用：${Array.isArray(s.use_for) ? s.use_for.join(" / ") : s.use_for}`);
  });

  lines.push(`\n${"─".repeat(50)}`);
  lines.push("【你要问他们的问题】");
  data.questions_to_ask?.forEach((q) => {
    lines.push(`  ▸ ${q.q}`);
    lines.push(`    原因：${q.why}`);
    if (q.timing) lines.push(`    时机：${q.timing}`);
  });

  if (data.danger_zones?.length) {
    lines.push(`\n${"─".repeat(50)}`);
    lines.push("【雷区预警】");
    data.danger_zones.forEach((d) => {
      lines.push(`  ⚠ ${d.zone}`);
      lines.push(`    → ${d.how_to_handle}`);
    });
  }

  lines.push(`\n${"─".repeat(50)}`);
  lines.push("【临场提醒】");
  data.custom_tips?.forEach((tip) => lines.push(`  • ${tip}`));

  lines.push(`\n${"=".repeat(50)}`);
  lines.push("  Powered by Interview Sprint ⚡");
  return lines.join("\n");
}

function CheatsheetView({ data, company, role }: { data: CheatsheetData; company: string; role: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(toPlainText(data, company, role));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = toPlainText(data, company, role);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `面试小抄_${company}_${role}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-8 mb-6 text-white">
        <h1 className="text-2xl font-bold">⚡ 面试小抄 · {company} · {role}</h1>
        <p className="text-slate-400 text-sm mt-1">生成时间：{new Date().toLocaleString("zh-CN")} · 基于你的简历和 JD 定制</p>
        <div className="flex gap-3 mt-4">
          <button onClick={handleDownload} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition cursor-pointer">⬇️ 下载文字版</button>
          <button onClick={handleCopy} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition cursor-pointer">
            {copied ? "✓ 已复制" : "📋 复制全文"}
          </button>
        </div>
      </div>

      {/* Company Intel */}
      {data.company_intel && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">🏢 公司情报速览</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.company_intel.culture_keywords?.map((k, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{k}</span>
            ))}
          </div>
          <p className="text-sm text-slate-600"><b>面试风格：</b>{data.company_intel.interview_style}</p>
          <p className="text-sm text-slate-600 mt-1"><b>近期关注：</b>{data.company_intel.recent_focus}</p>
        </div>
      )}

      {/* Opening Pitch */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">🎯 开场自我介绍（30秒版）</h3>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-lg p-5 text-slate-800 leading-relaxed">
          {data.opening_pitch}
        </div>
        <p className="text-xs text-slate-400 mt-2">💡 建议对着镜子练3遍，控制在30秒内</p>
      </div>

      {/* Two columns */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Requirements */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">📋 岗位核心要求</h3>
          {data.job_core_requirements?.map((r, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{r.req}</span>
                <span className={`text-xs font-bold ${r.weight === "高" ? "text-red-500" : "text-amber-500"}`}>{r.weight}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-1">→ {r.detail}</p>
            </div>
          ))}
        </div>

        {/* Match Points */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">✅ 你的核心匹配点</h3>
          {data.match_points?.map((mp, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
              <div className="font-semibold text-slate-800 text-sm min-w-[40%]">{mp.your_bg}</div>
              <span className="text-emerald-500 font-bold">→</span>
              <div className="text-sm text-slate-600">
                {mp.connects_to}
                {mp.gap && <p className="text-xs text-amber-500 mt-1">⚠ {mp.gap}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">❓ 高频预测题 × {data.key_questions?.length}</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {data.key_questions?.map((q, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4 border-l-[3px] border-purple-400">
              <p className="font-semibold text-slate-800 text-sm">Q{i + 1}. {q.q}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[q.type] || "bg-gray-100 text-gray-600"}`}>{q.type}</span>
                <span className="text-xs text-slate-500">考察：{q.angle}</span>
              </div>
              <div className="mt-2 bg-purple-50 rounded px-3 py-2 text-xs text-slate-600">{q.answer_frame}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STAR Stories */}
      {data.star_stories && data.star_stories.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {data.star_stories.map((story, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-bold text-amber-800 text-sm mb-3">📖 {story.title}</h4>
              {(["s", "t", "a", "r"] as const).map((key) => (
                <div key={key} className="mb-2">
                  <span className="font-bold text-amber-600 text-xs">{key.toUpperCase()}</span>{" "}
                  <span className="text-sm text-amber-900">{story[key]}</span>
                </div>
              ))}
              <div className="bg-amber-100 rounded px-3 py-2 mt-2 text-xs text-amber-800">
                🎯 {Array.isArray(story.use_for) ? story.use_for.join(" / ") : story.use_for}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Questions to ask */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">💬 你要问他们的问题</h3>
          {data.questions_to_ask?.map((q, i) => (
            <div key={i} className="py-3 border-b border-slate-100 last:border-0">
              <p className="font-semibold text-slate-800 text-sm">
                {q.q}
                {q.timing && <span className="text-xs text-slate-400 ml-2">({q.timing})</span>}
              </p>
              <p className="text-xs text-emerald-600 mt-1">→ {q.why}</p>
            </div>
          ))}
        </div>

        {/* Danger zones + tips */}
        <div className="space-y-4">
          {data.danger_zones && data.danger_zones.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 border-b-2 border-red-400 pb-2 mb-4">🚨 雷区预警</h3>
              {data.danger_zones.map((d, i) => (
                <div key={i} className="bg-red-50 rounded-lg px-4 py-3 mb-2 text-sm">
                  <p className="font-semibold text-red-800">⚠️ {d.zone}</p>
                  <p className="text-slate-600 text-xs mt-1">→ {d.how_to_handle}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b-2 border-amber-400 pb-2 mb-4">⚡ 临场提醒</h3>
            {data.custom_tips?.map((tip, i) => (
              <div key={i} className="bg-amber-50 rounded-lg px-4 py-2.5 mb-2 text-sm text-amber-900">
                💡 {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [result, setResult] = useState<{ data: CheatsheetData; company: string; role: string } | null>(null);

  const canGenerate = (company || role) && (jd || resumeText);

  const handleLogin = () => {
    if (!accessCode.trim()) {
      setLoginError("请输入访问码");
      return;
    }
    setLoginError("");
    setLoggedIn(true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, jd, resumeText, accessCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setLoggedIn(false);
          throw new Error("访问码无效，请重新登录");
        }
        throw new Error(data.error || "生成失败");
      }
      setResult({ data, company: company || "未知公司", role: role || "未知岗位" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // Result view
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-5xl mx-auto mb-4">
          <button
            onClick={() => setResult(null)}
            className="text-sm text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            ← 新建小抄
          </button>
        </div>
        <CheatsheetView data={result.data} company={result.company} role={result.role} />
      </div>
    );
  }

  // Login view
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">⚡ Interview Sprint</h1>
            <p className="text-slate-500">晋级突击 · 面试小抄生成器</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">输入访问码</label>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="请输入访问码"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
            >
              登录
            </button>
            <p className="text-xs text-slate-400 text-center mt-4">访问码请联系管理员获取</p>
          </div>
        </div>
      </div>
    );
  }

  // Main form view
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl font-bold text-slate-900 mb-3">⚡ Interview Sprint</h1>
        <p className="text-xl text-slate-500 mb-1">晋级突击</p>
        <p className="text-lg text-slate-400">提交简历 + 岗位信息，60秒生成专属面试小抄</p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 mb-4">📌 岗位信息</h2>
            <div className="space-y-3">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="公司名称，例：McKinsey、字节跳动"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="应聘岗位，例：Business Analyst、产品经理"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder={"粘贴 JD 全文，越详细越精准...\n\n支持中英文 JD"}
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 mb-4">📄 你的简历</h2>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder={"粘贴简历文字内容...\n\n教育背景、实习经历、项目经验都放进来\n\n（内容越详细，小抄越精准）"}
              rows={14}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>
        </div>

        {/* Generate button */}
        <div className="mt-6">
          {error && (
            <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>
          )}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full py-4 rounded-xl text-white font-bold text-lg transition disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 cursor-pointer"
          >
            {loading ? "正在分析简历 × JD，生成专属小抄...约 30-60 秒" : "⚡ 一键生成面试小抄"}
          </button>
        </div>
      </div>
    </div>
  );
}
