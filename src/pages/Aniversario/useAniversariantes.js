import { useCallback, useEffect, useState } from "react";

// Anos disponíveis no seletor — basta acrescentar o próximo aqui.
export const ANOS = [2026, 2027];

const CHAVE = "aniversariantes-anual:v1";
const mesesVazios = () => Array.from({ length: 12 }, () => []);
const VAZIO = mesesVazios();
const novoId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const ordenar = (lista) =>
  [...lista].sort((a, b) => a.dia - b.dia || a.nome.localeCompare(b.nome, "pt-BR"));
export const mesmaPessoa = (a, b) =>
  a.dia === b.dia && a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }) === 0;

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo && typeof salvo === "object") return salvo;
  } catch { /* sem dados salvos */ }
  return {};
}

// Aniversariantes por ano → 12 meses → [{ id, dia, nome }], salvos no navegador.
export function useAniversariantes() {
  const [anos, setAnos] = useState(carregar);

  useEffect(() => {
    try { localStorage.setItem(CHAVE, JSON.stringify(anos)); } catch { /* armazenamento indisponível */ }
  }, [anos]);

  const alterarMes = useCallback((ano, mes, fn) => {
    setAnos((prev) => {
      const meses = (prev[ano] ?? mesesVazios()).map((l, i) => (i === mes ? ordenar(fn(l)) : l));
      return { ...prev, [ano]: meses };
    });
  }, []);

  const adicionar = useCallback((ano, mes, pessoas) => {
    const novos = pessoas.map((p) => ({ id: novoId(), dia: p.dia, nome: p.nome }));
    alterarMes(ano, mes, (l) => [...l, ...novos]);
    return novos;
  }, [alterarMes]);

  const atualizar = useCallback((ano, mes, id, dados) =>
    alterarMes(ano, mes, (l) => l.map((p) => (p.id === id ? { ...p, ...dados } : p))), [alterarMes]);

  const remover = useCallback((ano, mes, id) =>
    alterarMes(ano, mes, (l) => l.filter((p) => p.id !== id)), [alterarMes]);

  const restaurar = useCallback((ano, mes, pessoa) =>
    alterarMes(ano, mes, (l) => (l.some((p) => p.id === pessoa.id) ? l : [...l, pessoa])), [alterarMes]);

  const copiarAno = useCallback((origem, destino) => {
    setAnos((prev) => ({
      ...prev,
      [destino]: (prev[origem] ?? mesesVazios()).map((l) => l.map((p) => ({ ...p, id: novoId() }))),
    }));
  }, []);

  const mesesDoAno = useCallback((ano) => anos[ano] ?? VAZIO, [anos]);

  return { mesesDoAno, adicionar, atualizar, remover, restaurar, copiarAno, ordenar };
}

