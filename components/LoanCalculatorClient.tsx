"use client";

import { useState, useMemo } from "react";

type RepaymentType = "annuity" | "declining";

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtCurrency(n: number, symbol: string) {
  return symbol + fmt(n);
}

interface Schedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function buildSchedule(principal: number, annualRate: number, months: number, type: RepaymentType): Schedule[] {
  const r = annualRate / 100 / 12;
  const schedule: Schedule[] = [];
  let balance = principal;

  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    let payment: number;
    let principalPaid: number;

    if (type === "annuity") {
      if (r === 0) {
        payment = principal / months;
      } else {
        payment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      }
      principalPaid = payment - interest;
    } else {
      principalPaid = principal / months;
      payment = principalPaid + interest;
    }

    balance = Math.max(0, balance - principalPaid);
    schedule.push({ month: i, payment, principal: principalPaid, interest, balance });
  }
  return schedule;
}

export default function LoanCalculatorClient() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("30");
  const [type, setType] = useState<RepaymentType>("annuity");
  const [currency, setCurrency] = useState("$");
  const [showTable, setShowTable] = useState(false);

  const schedule = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const m = parseInt(years) * 12;
    if (!p || !r || !m || p <= 0 || r < 0 || m <= 0) return null;
    return buildSchedule(p, r, m, type);
  }, [principal, rate, years, type]);

  const summary = useMemo(() => {
    if (!schedule) return null;
    const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
    const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
    const p = parseFloat(principal);
    return {
      monthly: type === "annuity" ? schedule[0].payment : null,
      firstPayment: schedule[0].payment,
      lastPayment: schedule[schedule.length - 1].payment,
      totalPayment,
      totalInterest,
      interestPct: (totalInterest / p) * 100,
    };
  }, [schedule, principal, type]);

  const Field = ({ label, value, onChange, suffix, min, step }: {
    label: string; value: string; onChange: (v: string) => void; suffix?: string; min?: string; step?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          step={step}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-800 text-sm">Loan Details</h3>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-500">Currency:</span>
            {["$", "€", "£", "¥", "₫"].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`w-7 h-7 rounded-lg font-medium transition-colors ${
                  currency === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <Field label="Loan Amount" value={principal} onChange={setPrincipal} suffix={currency} min="0" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" min="0" step="0.1" />
          <Field label="Loan Term" value={years} onChange={setYears} suffix="yrs" min="1" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Repayment Type</label>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm">
            {([["annuity", "Fixed payment"], ["declining", "Declining balance"]] as const).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setType(val)}
                className={`flex-1 py-2.5 font-medium transition-colors ${
                  type === val ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {type === "annuity"
              ? "Same payment every month — most common for mortgages."
              : "Fixed principal + decreasing interest — total interest is lower."}
          </p>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
          {type === "annuity" ? (
            <div className="text-center">
              <p className="text-xs font-medium text-blue-500 mb-1">Monthly Payment</p>
              <p className="text-4xl font-bold text-blue-800">{fmtCurrency(summary.firstPayment, currency)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs font-medium text-blue-500 mb-1">First Payment</p>
                <p className="text-2xl font-bold text-blue-800">{fmtCurrency(summary.firstPayment, currency)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-500 mb-1">Last Payment</p>
                <p className="text-2xl font-bold text-blue-800">{fmtCurrency(summary.lastPayment, currency)}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-100">
            <div className="text-center">
              <p className="text-xs text-blue-500 mb-0.5">Total Paid</p>
              <p className="font-bold text-blue-900 text-sm">{fmtCurrency(summary.totalPayment, currency)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-500 mb-0.5">Total Interest</p>
              <p className="font-bold text-blue-900 text-sm">{fmtCurrency(summary.totalInterest, currency)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-500 mb-0.5">Interest Share</p>
              <p className="font-bold text-blue-900 text-sm">{fmt(summary.interestPct, 1)}%</p>
            </div>
          </div>
          {/* Progress bar: principal vs interest */}
          <div>
            <div className="flex rounded-full overflow-hidden h-3">
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${100 - summary.interestPct}%` }}
                title={`Principal: ${fmtCurrency(parseFloat(principal), currency)}`}
              />
              <div
                className="bg-orange-400 transition-all"
                style={{ width: `${Math.min(summary.interestPct, 100)}%` }}
                title={`Interest: ${fmtCurrency(summary.totalInterest, currency)}`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-blue-500" />Principal</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-orange-400" />Interest</span>
            </div>
          </div>
        </div>
      )}

      {/* Amortization table toggle */}
      {schedule && (
        <div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>Amortization schedule ({schedule.length} months)</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showTable ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTable && (
            <div className="mt-2 border border-gray-200 rounded-xl overflow-auto max-h-72">
              <table className="w-full text-xs text-right">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-gray-500">
                    <th className="px-3 py-2 text-left font-medium">Month</th>
                    <th className="px-3 py-2 font-medium">Payment</th>
                    <th className="px-3 py-2 font-medium">Principal</th>
                    <th className="px-3 py-2 font-medium">Interest</th>
                    <th className="px-3 py-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="px-3 py-1.5 text-left text-gray-500">{row.month}</td>
                      <td className="px-3 py-1.5 font-medium text-gray-800">{fmt(row.payment)}</td>
                      <td className="px-3 py-1.5 text-blue-700">{fmt(row.principal)}</td>
                      <td className="px-3 py-1.5 text-orange-600">{fmt(row.interest)}</td>
                      <td className="px-3 py-1.5 text-gray-600">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
