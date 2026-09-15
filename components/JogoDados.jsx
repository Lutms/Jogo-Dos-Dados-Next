"use client";

import { useEffect, useState } from "react";
import Dado from "./Dado";

const TOTAL_RODADAS = 5;
const TEMPO_ENTRE_RODADAS = 1800; // ms, tempo para o jogador ler o resultado

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function estadoInicialDados() {
  return {
    1: [null, null],
    2: [null, null],
  };
}

export default function JogoDados() {
  const [rodadaAtual, setRodadaAtual] = useState(1);
  const [dados, setDados] = useState(estadoInicialDados());
  // turno: 1 -> vez do jogador 1, 2 -> vez do jogador 2, null -> rodada concluída
  const [turno, setTurno] = useState(1);
  const [mensagem, setMensagem] = useState("Vez do Jogador 1");
  const [placar, setPlacar] = useState({ 1: 0, 2: 0, empates: 0 });
  const [fimDeJogo, setFimDeJogo] = useState(false);

  // Avança automaticamente para a próxima rodada (ou finaliza o jogo)
  // depois que os dois jogadores já jogaram na rodada atual.
  useEffect(() => {
    if (turno !== null || fimDeJogo) return;

    const timer = setTimeout(() => {
      if (rodadaAtual >= TOTAL_RODADAS) {
        setFimDeJogo(true);
      } else {
        setRodadaAtual((r) => r + 1);
        setDados(estadoInicialDados());
        setTurno(1);
        setMensagem("Vez do Jogador 1");
      }
    }, TEMPO_ENTRE_RODADAS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turno, fimDeJogo]);

  function jogar(jogador) {
    if (fimDeJogo || turno !== jogador) return;

    const novoPar = [rolarDado(), rolarDado()];
    const novosDados = { ...dados, [jogador]: novoPar };
    setDados(novosDados);

    if (jogador === 1) {
      setTurno(2);
      setMensagem("Vez do Jogador 2");
      return;
    }

    // Jogador 2 acabou de jogar: apura o resultado da rodada
    const soma1 = novosDados[1][0] + novosDados[1][1];
    const soma2 = novosDados[2][0] + novosDados[2][1];

    if (soma1 > soma2) {
      setMensagem("Jogador 1 venceu");
      setPlacar((p) => ({ ...p, 1: p[1] + 1 }));
    } else if (soma2 > soma1) {
      setMensagem("Jogador 2 venceu");
      setPlacar((p) => ({ ...p, 2: p[2] + 1 }));
    } else {
      setMensagem("Empate");
      setPlacar((p) => ({ ...p, empates: p.empates + 1 }));
    }

    setTurno(null); // rodada concluída, dispara o useEffect acima
  }

  function jogarNovamente() {
    setRodadaAtual(1);
    setDados(estadoInicialDados());
    setTurno(1);
    setMensagem("Vez do Jogador 1");
    setPlacar({ 1: 0, 2: 0, empates: 0 });
    setFimDeJogo(false);
  }

  function mensagemFinal() {
    if (placar[1] > placar[2]) return "Jogador 1 venceu o jogo";
    if (placar[2] > placar[1]) return "Jogador 2 venceu o jogo";
    return "Empate geral";
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-center text-2xl font-semibold text-slate-800">
        Jogo de Dados
      </h1>

      <p className="text-center text-sm font-medium text-slate-500">
        Rodada {rodadaAtual}/{TOTAL_RODADAS}
      </p>

      <div className="grid grid-cols-2 divide-x divide-slate-200">
        <div className="flex flex-col items-center gap-3 pr-3">
          <span className="text-sm font-semibold text-slate-700">
            Jogador 1
          </span>
          <div className="flex gap-2">
            <Dado valor={dados[1][0]} />
            <Dado valor={dados[1][1]} />
          </div>
          <button
            type="button"
            onClick={() => jogar(1)}
            disabled={fimDeJogo || turno !== 1}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 enabled:hover:bg-slate-800 enabled:hover:text-white"
          >
            Jogar
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 pl-3">
          <span className="text-sm font-semibold text-slate-700">
            Jogador 2
          </span>
          <div className="flex gap-2">
            <Dado valor={dados[2][0]} />
            <Dado valor={dados[2][1]} />
          </div>
          <button
            type="button"
            onClick={() => jogar(2)}
            disabled={fimDeJogo || turno !== 2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 enabled:hover:bg-slate-800 enabled:hover:text-white"
          >
            Jogar
          </button>
        </div>
      </div>

      <div
        className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-700"
        aria-live="polite"
      >
        {fimDeJogo ? mensagemFinal() : mensagem}
      </div>

      {fimDeJogo && (
        <button
          type="button"
          onClick={jogarNovamente}
          className="w-full rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Jogar novamente
        </button>
      )}
    </div>
  );
}
