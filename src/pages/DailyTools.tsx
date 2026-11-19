import { useEffect, useMemo, useReducer, useState } from "react";
import { ToolButton, ToolCard, ToolInput, ToolLabel, ToolMessage, ToolResult, ToolSelect, ToolShell } from "../components/ToolShell";

export function DailyTools() {
  return (
    <ToolShell
      title="日常工具"
      description="单位换算、汇率换算、倒计时和番茄钟，适合在开发间隙快速使用。"
      tabs={[
        { id: "unit", label: "单位换算", content: <UnitTab /> },
        { id: "exchange", label: "汇率换算", content: <ExchangeTab /> },
        { id: "countdown", label: "倒计时", content: <CountdownTab /> },
        { id: "pomodoro", label: "番茄钟", content: <PomodoroTab /> },
      ]}
    />
  );
}

const unitGroups = {
  length: { label: "长度", units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, mile: 1609.344 } },
  weight: { label: "重量", units: { g: 1, kg: 1000, ton: 1000000, lb: 453.59237, oz: 28.349523 } },
  data: { label: "数据", units: { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 } },
} as const;

type UnitGroup = keyof typeof unitGroups;

function UnitTab() {
  const [group, setGroup] = useState<UnitGroup>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const units = unitGroups[group].units;

  const result = useMemo(() => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    if (!(from in units) || !(to in units)) return "";
    return ((number * units[from as keyof typeof units]) / units[to as keyof typeof units]).toString();
  }, [value, from, to, units]);

  function changeGroup(next: string) {
    const nextGroup = next as UnitGroup;
    setGroup(nextGroup);
    const first = Object.keys(unitGroups[nextGroup].units)[0];
    setFrom(first);
    setTo(first);
  }

  return (
    <ToolCard title="单位换算">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <ToolLabel htmlFor="unit-group">类别</ToolLabel>
          <ToolSelect id="unit-group" value={group} onChange={changeGroup} options={[
            { value: "length", label: "长度" },
            { value: "weight", label: "重量" },
            { value: "data", label: "数据大小" },
          ]} />
        </div>
        <div>
          <ToolLabel htmlFor="unit-from">原始单位</ToolLabel>
          <ToolSelect id="unit-from" value={from} onChange={setFrom} options={Object.entries(units).map(([value2, label]) => ({ value: value2, label: String(label) }))} />
        </div>
        <div>
          <ToolLabel htmlFor="unit-to">目标单位</ToolLabel>
          <ToolSelect id="unit-to" value={to} onChange={setTo} options={Object.entries(units).map(([value2, label]) => ({ value: value2, label: String(label) }))} />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <ToolLabel htmlFor="unit-value">数值</ToolLabel>
          <ToolInput id="unit-value" type="number" value={value} onChange={setValue} />
        </div>
        <div>
          <ToolLabel>换算结果</ToolLabel>
          <ToolResult className="font-mono">{result || "—"}</ToolResult>
        </div>
      </div>
    </ToolCard>
  );
}

const currencyCodes = ["CNY", "USD", "EUR", "JPY", "GBP", "HKD", "SGD", "AUD"];

function ExchangeTab() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [base, setBase] = useState("CNY");
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRates() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
      if (!response.ok) throw new Error(`请求失败：${response.status}`);
      const data = (await response.json()) as { rates: Record<string, number> };
      setRates(data.rates);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "汇率加载失败。");
      setRates(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolCard title="汇率换算">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <ToolLabel htmlFor="currency-base">基准货币</ToolLabel>
          <ToolSelect id="currency-base" value={base} onChange={setBase} options={currencyCodes.map((code) => ({ value: code, label: code }))} />
        </div>
        <div>
          <ToolLabel htmlFor="currency-amount">金额</ToolLabel>
          <ToolInput id="currency-amount" type="number" value={amount} onChange={setAmount} />
        </div>
        <div className="flex items-end">
          <ToolButton primary onClick={() => void loadRates()} disabled={loading}>{loading ? "加载中…" : "获取最新汇率"}</ToolButton>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {error ? <ToolMessage kind="error">{error}</ToolMessage> : null}
        {rates ? currencyCodes.filter((code) => code !== base).map((code) => {
          const rate = rates[code];
          if (!rate) return null;
          return (
            <div key={code} className="flex items-center justify-between border border-brand-border bg-brand-bg px-4 py-3 text-sm">
              <span className="text-gray-400">{base} → {code}</span>
              <span className="font-mono text-brand-accent">{((Number(amount) || 0) * rate).toFixed(2)} {code}</span>
            </div>
          );
        }) : <span className="text-gray-600">点击按钮后显示换算结果。</span>}
      </div>
      <ToolMessage>汇率来自公开 Frankfurter API，仅供参考，不构成交易依据。</ToolMessage>
    </ToolCard>
  );
}

function CountdownTab() {
  const [target, setTarget] = useState("");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = useMemo(() => {
    if (!target || now === null) return null;
    const targetTime = new Date(target).getTime();
    if (!Number.isFinite(targetTime)) return null;
    return targetTime - now;
  }, [target, now]);

  const formatted = formatDuration(remaining ?? 0);

  return (
    <ToolCard title="倒计时">
      <ToolLabel htmlFor="countdown-target">目标时间</ToolLabel>
      <ToolInput id="countdown-target" type="datetime-local" value={target} onChange={setTarget} />
      <div className="mt-6 border border-brand-border bg-brand-bg p-8 text-center">
        <div className="font-mono text-5xl text-brand-accent">{remaining === null ? "--:--:--" : formatted}</div>
        <div className="mt-3 text-sm text-gray-500">
          {remaining === null ? "选择目标时间" : remaining > 0 ? "距离目标时间" : "倒计时已结束"}
        </div>
      </div>
    </ToolCard>
  );
}

type PomodoroMode = "work" | "break";

interface PomodoroState {
  mode: PomodoroMode;
  secondsLeft: number;
  running: boolean;
  completed: number;
}

type PomodoroAction = { type: "tick" | "toggle" | "reset" | "switch"; mode?: PomodoroMode };

const pomodoroDurations: Record<PomodoroMode, number> = { work: 25 * 60, break: 5 * 60 };

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  if (action.type === "tick") {
    if (!state.running) return state;
    if (state.secondsLeft > 1) return { ...state, secondsLeft: state.secondsLeft - 1 };
    if (state.mode === "work") {
      return { mode: "break", secondsLeft: pomodoroDurations.break, running: true, completed: state.completed + 1 };
    }
    return { mode: "work", secondsLeft: pomodoroDurations.work, running: false, completed: state.completed };
  }
  if (action.type === "toggle") return { ...state, running: !state.running };
  if (action.type === "reset") {
    const mode = action.mode ?? state.mode;
    return { mode, secondsLeft: pomodoroDurations[mode], running: false, completed: state.completed };
  }
  const mode = action.mode ?? state.mode;
  return { mode, secondsLeft: pomodoroDurations[mode], running: false, completed: state.completed };
}

function PomodoroTab() {
  const [state, dispatch] = useReducer(pomodoroReducer, {
    mode: "work", secondsLeft: pomodoroDurations.work, running: false, completed: 0,
  });

  useEffect(() => {
    if (!state.running) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, [state.running]);

  const progress = 1 - state.secondsLeft / pomodoroDurations[state.mode];

  return (
    <ToolCard title="番茄钟">
      <div className="flex gap-2">
        <button type="button" onClick={() => dispatch({ type: "switch", mode: "work" })} className={`px-4 py-2 text-sm transition ${state.mode === "work" ? "bg-brand-accent font-medium text-zinc-950" : "border border-brand-border text-gray-400"}`}>专注 25 分钟</button>
        <button type="button" onClick={() => dispatch({ type: "switch", mode: "break" })} className={`px-4 py-2 text-sm transition ${state.mode === "break" ? "bg-brand-accent font-medium text-zinc-950" : "border border-brand-border text-gray-400"}`}>休息 5 分钟</button>
      </div>
      <div className="mt-6 border border-brand-border bg-brand-bg p-8 text-center">
        <div className="font-mono text-6xl text-brand-accent">{formatClock(state.secondsLeft)}</div>
        <div className="mt-2 h-2 bg-brand-card">
          <div className="h-full bg-brand-accent transition-all" style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <ToolButton primary onClick={() => dispatch({ type: "toggle" })}>{state.running ? "暂停" : "开始"}</ToolButton>
          <ToolButton onClick={() => dispatch({ type: "reset" })}>重置</ToolButton>
        </div>
        <div className="mt-4 text-sm text-gray-500">已完成专注：{state.completed} 个</div>
      </div>
    </ToolCard>
  );
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days) return `${days} 天 ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
